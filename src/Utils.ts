import { DateTime, Duration } from "luxon";

export class Utils {
    private static readonly format = "dd.MM.yyyy hh:mm";

    public static parseDateTimeString(dateTimeString: string) {
        return DateTime.fromFormat(dateTimeString, this.format);
    }

    public static printFormattedDateTimeString(dateTime: DateTime) {
        return dateTime.toFormat(this.format);
    }

    // Format: '14:00'
    public static parseUsageTimeDateTimeString(timeString: string): DateTime {
        return DateTime.fromISO("2000-01-01T" + timeString)
    }
}