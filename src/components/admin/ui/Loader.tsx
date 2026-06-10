import classes from "./Loader.module.css";

export default function Loader() {
  return (
    <div className="py-40 flex flex-col items-center">
      <div className={`${classes.dots}`}></div>
    </div>
  );
}
