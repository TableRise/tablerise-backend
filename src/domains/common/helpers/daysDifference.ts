const MILISECS_TO_DAY = 1000 * 60 * 60 * 24;
const todayInMilisecs =  new Date().getTime();

export default (exclusionDateInMilisecs: number ) : number => Math.floor(( todayInMilisecs - exclusionDateInMilisecs )/MILISECS_TO_DAY);