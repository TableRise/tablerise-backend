


export default (dateInMilisecs: number, daysAmount: number ) : boolean => {
    const MILISECS_TO_DAY = 1000 * 60 * 60 * 24;
    const todayInMilisecs =  new Date().getTime();
    return Math.floor(( todayInMilisecs - dateInMilisecs )/MILISECS_TO_DAY) >= daysAmount;

}