
export interface Analystic {
    sportItem: String
    id: number;
    members: String;
    name: string;
    vote: String;
    category: [{}];
    tournament: { 
        id: number, 
        name: string; };
    events: [{
        id: number, 
        homeTeam: { 
            name: string, 
            id: number 
            },
        awayTeam: {
             id: number 
            }, 
        formatedStartDate: string,
        sport: string,
        startTimestamp: number,
        winnerCode: number,
        status: { 
            code: number 
        }
    }];
};

export interface Members {
    sportItem: String
    members: String;
};
