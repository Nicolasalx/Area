import { ActionDate } from "@common/interfaces/timer.interface";

export class TimerUtils {
    static parseActionDate(data: any): ActionDate {
        if (!data?.hour) {
            throw new Error('Invalid timer data: missing hour');
        }
        return {
            date: data?.date || new Date().toISOString().split('T')[0],
            hour: data.hour,
        };
    }

    static createTargetDate(data: ActionDate): Date {
        return new Date(`${data.date}T${data.hour}:00`);
    }
}
