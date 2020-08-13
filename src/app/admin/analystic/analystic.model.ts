
export interface Analystic {
    sportItem: String
    id: number;
    members: String;
    name: string;
    vote: String;
    category: [{}];
    tournament: { 
        id: number, 
        events: [{}],
        name: string; };
    season: {
        id: number
    },
    events: [{
        turnament: any,
        id: number, 
        homeTeam: { 
            name: string, 
            id: number 
            },
        awayTeam: {
             id: number ,
             name: string
            }, 
        formatedStartDate: string,
        lastHome: any,
        lastAway: any;
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
