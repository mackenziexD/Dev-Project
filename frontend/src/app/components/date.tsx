import { parseISO, format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

function DateComponent({ dateString }) {
    const date = parseISO(dateString);
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zonedDate = date; // Assuming you have a toZonedTime function to apply the timezone
    const formattedDate = format(zonedDate, 'hh:mm a - eee do LLLL, yyyy', { timeZone: userTimeZone });

    return <time dateTime={dateString}>{formattedDate}</time>;
}

function shortDate(dateString) {
    const date = parseISO(dateString);
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zonedDate = toZonedTime(date, userTimeZone);
    
    const formattedDate = format(zonedDate, 'yyyy-MM-dd HH:mm', { timeZone: userTimeZone });

    return formattedDate;
}

export { 
    DateComponent,
    shortDate
};