import { DateTime } from "luxon";

export class Utils {
    private static readonly format = "dd.MM.yyyy hh:mm";

    public static parseDateTimeString(dateTimeString: string) {
        return DateTime.fromFormat(dateTimeString, this.format);
    }

    public static printFormattedDateTimeString(dateTime: DateTime) {
        return dateTime.toFormat(this.format);
    }
}