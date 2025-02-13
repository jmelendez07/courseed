import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import 'dayjs/locale/es';

dayjs.locale('es');
dayjs.extend(localizedFormat);