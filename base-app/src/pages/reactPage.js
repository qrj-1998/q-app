import QApp from "../q-app";

QApp.start();

export default function ReactPage() {
  return (
    <div>
      <h1>React Page</h1>
      <p>This is a React page</p>
      <q-app url="http://localhost:3001/" name="react-app" />
    </div>
  );
}