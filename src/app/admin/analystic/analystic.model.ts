
export interface  Analystic {
    sportItem: String
    members: String;
    vote: String;
    category: [{}];
    tournament: {id:number};
    events: [{formatedStartDate: string,id:string,sport:string,startTimestamp:number,winnerCode: number,status:{code: number}}];
};

export interface  Members {
    sportItem: String
    members: String;
};
