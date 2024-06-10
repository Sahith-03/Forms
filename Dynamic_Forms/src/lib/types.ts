export type Field = {
    field_name: string;
    field_type: string;
    options: string[];
};

export type Schema = Field[];

export type FormData = Record<string, string | number>;
