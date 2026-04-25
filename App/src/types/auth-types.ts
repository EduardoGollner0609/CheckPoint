export type RegisterCompanyDTO = {
    name: string;
    document: string;
    email: string;
    password: string;
};

export type RegisterEmployeeDTO = {
    name: string;
    document: string;
    email: string;
    password: string;
    companyCode: string;
};

export type RegisterSelfEmployedDTO = {
    name: string;
    document: string;
    email: string;
    password: string;
};


export type LoginRequestDTO = {
    email: string,
    password: string
}
