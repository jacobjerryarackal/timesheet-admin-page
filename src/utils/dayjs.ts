import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(isBetween);
dayjs.extend(weekOfYear);

export default dayjs;
