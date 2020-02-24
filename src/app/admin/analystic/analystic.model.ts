
export interface  Analystic {
    sportItem: String
    members: String;
    vote: String;
    category: [{}];
    events: [{formatedStartDate: string,id:string,sport:string,startTimestamp:number,winnerCode: number}];
};

export interface  Members {
    sportItem: String
    members: String;
};
