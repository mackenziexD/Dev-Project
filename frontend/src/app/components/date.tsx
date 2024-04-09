import { parseISO, format } from 'date-fns';

export default function Date({ dateString }: { dateString: any }) {
    const date = parseISO(dateString);
    return <time dateTime={dateString}>{format(date, 'hh:mm a - eee io LLLL, yyyy')}</time>;
}