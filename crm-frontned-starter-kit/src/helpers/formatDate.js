import moment from "moment";

export default function formatDate(date, format = "DD/MM/YYYY hh:mm A ZZ") {
  return moment(date).format(format);
}