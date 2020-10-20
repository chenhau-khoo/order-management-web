export interface Order {
    id: string;
    status: string;
    desc: string;
    amount: number;
    createdOn: Date;
    updatedOn: Date;
}
