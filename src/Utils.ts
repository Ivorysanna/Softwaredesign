import { DateTime, Duration } from "luxon";

export class Utils {
    private static readonly FORMAT = "dd.MM.yyyy hh:mm";

    public static parseDateTimeString(dateTimeString: string) {
        return DateTime.fromFormat(dateTimeString, this.FORMAT);
    }

    public static printFormattedDateTimeString(dateTime: DateTime): string {
        return dateTime.toFormat(this.FORMAT);
    }

    // Format: '14:00'
    public static parseUsageTimeDateTimeString(timeString: string): DateTime {
        return DateTime.fromISO("2000-01-01T" + timeString)
    }
}