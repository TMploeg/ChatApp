import { Spinner } from "react-bootstrap";
import "./LoadingPage.scss";

interface Props {
  loaded: boolean;
  children: any;
}

export default function LoadingPage({ loaded, children }: Props) {
  if (!loaded) {
    return (
      <div className="loading-page">
        <Spinner style={{ width: "5em", height: "5em" }} />
      </div>
    );
  }

  return <>{children}</>;
}
