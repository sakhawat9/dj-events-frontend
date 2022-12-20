import Layout from "@/components/Layout";
import { API_URL } from "../config";

export default function HomePage({ event }) {
  console.log(event);
  return (
    <Layout>
      <h1>Events</h1>
      {event.length === 0 && <h3>NO EVENT TO SHOW</h3>}

      {event.map((evt) => (
        <h3 key={evt.id}>{evt.name}</h3>
      ))}
    </Layout>
  );
}

export async function getStaticProps() {
  const res = await fetch(`${API_URL}/event`);
  const event = await res.json();

  return {
    props: { event },
    revalidate: 1,
  };
}
