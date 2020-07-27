
export interface  Analystic {
    sportItem: String
    id: number;
    members: String;
    name:string;
    vote: String;
    category: [{}];
    tournament: {id:number, name:string;};
    events: [{formatedStartDate: string,id:string,sport:string,startTimestamp:number,winnerCode: number,status:{code: number}}];
};

export interface  Members {
    sportItem: String
    members: String;
};
