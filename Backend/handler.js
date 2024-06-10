const mysql = require('mysql2');

let current_schema = [];

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '0000',
    database: 'dynamic_form'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

const getFormSchema = (req, res) => {
    db.query('SELECT * FROM form_schema', (err, result) => {
        if (err) throw err;
        current_schema = result;
    
        // Create an array of Promises for fetching options
        let fetchOptionsPromises = current_schema.map(field => {
            return new Promise((resolve, reject) => {
                if (field.field_type === 'select' || field.field_type === 'radio' || field.field_type === 'checkbox') {
                    db.query(`SELECT COLUMN_TYPE FROM information_schema.COLUMNS WHERE TABLE_NAME = 'form_data' AND COLUMN_NAME = '${field.field_name}'`, (err, result) => {
                        if (err) return reject(err);
                        const options = result[0].COLUMN_TYPE.match(/'([^']+)'/g).map(option => option.replace(/'/g, ''));
                        field.options = options;
                        resolve();
                    });
                } else {
                    resolve();
                }
            });
        });
    
        // Wait for all Promises to complete before sending the response
        Promise.all(fetchOptionsPromises)
            .then(() => {
                res.json(current_schema);
            })
            .catch(err => {
                console.error('Error fetching options:', err);
                res.status(500).send('Error fetching options');
            });
    });    
};

const updateFormSchema = (req, res) => {
    current_schema = req.body.schema;
    let current_schema_columns = [];

    // First, get the existing columns from form_data
    db.query('SELECT field_name FROM form_schema', (err, result) => {
        if (err) {
            console.error('Error fetching columns:', err);
        }
        for (let column of result){
            current_schema_columns.push(column['field_name']);
        }

    

        // Process current schema to add new fields
        let addColumnPromises = current_schema.map(field => {
            return new Promise((resolve, reject) => {
                const { field_name, field_type } = field;
                if (!current_schema_columns.includes(field_name.trim())) {
                    db.query("INSERT INTO form_schema (field_name, field_type) VALUES (?, ?)", [field_name.trim(), field_type], (err, result) => {
                        console.log("field_name:",field_name.trim())
                        if (err) return reject(err);
                    });      
                } 
                else {
                    current_schema_columns.splice(current_schema_columns.indexOf(field_name.trim()), 1);
                }

                let current_data_columns = [];
                db.query(`SELECT column_name FROM information_schema.columns WHERE table_schema = "dynamic_form" AND table_name = "form_data"`, (err, result) => {
                    if (err) return reject(err);
                    for (let column of result) {
                        current_data_columns.push(column['COLUMN_NAME']);
                    }
                    current_data_columns.splice(current_data_columns.indexOf('id'), 1);
                    console.log("current_data_columns:",current_data_columns)

                    if(!current_data_columns.includes(field_name.trim())){
                        console.log(field_name.trim(),current_data_columns,current_data_columns.includes(field_name.trim()))
                        if (field_type === 'select' || field_type === 'radio') {
                            // For select, radio, and checkbox types, handle options
                            const options = field.options.map(option => `'${option}'`).join(', ');
                            db.query(`ALTER TABLE form_data ADD COLUMN \`${field_name.trim()}\` ENUM(${options})`, (err, result) => {
                                if (err) return reject(err);
                            });
                        } 
                        else if(field_type === 'checkbox'){
                            const options = field.options.map(option => `'${option}'`).join(', ');
                            db.query(`ALTER TABLE form_data ADD COLUMN \`${field_name.trim()}\` SET(${options})`, (err, result) => {
                                if (err) return reject(err);
                            });
                        }
                        else {
                            // For other types, add as usual
                            let dbFieldType = field_type;
                            if (field_type.toLowerCase() === 'number') {
                                dbFieldType = 'INT';
                            } else if (field_type.toLowerCase() === 'email') {
                                dbFieldType = 'VARCHAR(255)';
                            }
                            db.query(`ALTER TABLE form_data ADD COLUMN \`${field_name.trim()}\` ${dbFieldType}`, (err, result) => {
                                if (err) return reject(err);
                            });
                        }
                    }
                    else{ 
                    if(field_type === 'select' || field_type === 'radio' || field_type === 'checkbox'){
                            const newOptions = field.options;
                            db.query(`SELECT COLUMN_TYPE FROM information_schema.columns WHERE table_schema = "dynamic_form" AND table_name = "form_data" AND column_name = "${field_name.trim()}"`, (err, result) => {
                                if (err) return reject(err);
                                // new options = present options UNION current options;
                                console.log("result:",result)
                                const columnType = result[0].COLUMN_TYPE;
                                const regex = /enum\((.*?)\)/i;
                                const match = columnType.match(regex);

                                const oldOptions = match[1].split(',').map(option => option.replace(/'/g, ''));
                                console.log("oldOptions:",oldOptions);
                                console.log("newOptions:",newOptions);
                                if (!(oldOptions===newOptions && oldOptions.length === newOptions.length)) {
                                    const newOptionsString = [...new Set([...oldOptions, ...newOptions])].map(option => `'${option}'`).join(', ');
                                    console.log(newOptionsString);
                                    db.query(`ALTER TABLE form_data MODIFY COLUMN \`${field_name.trim()}\` ENUM(${newOptionsString})`, (err) => {
                                        if (err) return reject(err);
                                    });
                                }
                            });
                        }
                    }
                })


            });


        });

        let removeColumnPromises = current_schema_columns.map(field => {
            return new Promise((resolve, reject) => {
                db.query("DELETE FROM form_schema WHERE field_name = ?", [field], (err, result) => {
                    if (err) return reject(err);

                    // db.query(`ALTER TABLE form_data DROP COLUMN \`${field}\``, (err, result) => {
                    //     if (err) return reject(err);
                    //     // resolve();
                    // });
                });
            });
        });

        // Execute all promises and send the final response
        Promise.all([...addColumnPromises,...removeColumnPromises])
            .then(() => {
                console.log('Schema updated successfully');
                res.json({ message: 'Schema updated successfully' });
                getFormSchema(req, res);
            })
            .catch(err => {
                console.error('Error updating schema:', err);
                res.status(500).json({ message: 'Error updating schema' });
            });
    });
};

const updateResponse = (req, res) => {
    const data = req.body;
    let columns = [];
    let values = [];

    for (let key in data) {
        columns.push(key);
        values.push(data[key]);
    }
    console.log("values:",values)
    if(values.includes('')){
        res.status(400).json({message: 'Please fill all fields'});
        return;
    }
    const valuesString = values.map(val => typeof val !== 'string' ? `'${val}'` : `'${val}'`).join(',');
    const query = `INSERT INTO form_data (\`${columns.join('`,`')}\`) VALUES (${valuesString})`;
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error inserting response:', err);
            res.status(500).json({message: 'Error inserting response'});
        } else {
            res.status(200).send('Response inserted successfully');
        }
    });
}

const getResponse = (req,res) => {
    db.query('SELECT * FROM form_data', (err, result) => {
        if (err) {
            console.error('Error fetching response:', err);
            res.status(500).json({ message: 'Error fetching response' });
        } else {
            res.json(result);
        }
    });
}

const deleteResponse = (req, res) => {
    db.query('DELETE FROM form_data', (err, result) => {
        if (err) {
            console.error('Error deleting responses:', err);
            res.status(500).send('Error deleting responses');
        } else {
            res.send('Responses deleted successfully');
        }
    });
}

module.exports = {
    getFormSchema,
    updateFormSchema,
    updateResponse,
    getResponse,
    deleteResponse
};
