
export interface  Event {
    sportItem: String;
    members: String;
    sport:string;
    vote: String;
    status:String,
    markets: string;
    event: [{status:{ code:string}}],
    events: [{incidents: {}, status:{ code:string}}]
    // markets: Market;
};
export interface Market {}

