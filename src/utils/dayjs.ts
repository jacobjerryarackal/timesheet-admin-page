import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import weekOfYear from "dayjs/plugin/weekOfYear";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(isBetween);
dayjs.extend(weekOfYear);
dayjs.extend(relativeTime);

export default dayjs;
