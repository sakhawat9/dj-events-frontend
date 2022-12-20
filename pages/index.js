import EventItem from "@/components/EventItem";
import Layout from "@/components/Layout";
import Link from "next/link";
import { API_URL } from "../config";

export default function HomePage({ event }) {
  console.log(event);
  return (
    <Layout>
      <h1>Events</h1>
      {event.length === 0 && <h3>NO EVENT TO SHOW</h3>}

      {event.map((evt) => (
        <EventItem key={evt.id} evt={evt} />
      ))}

      {event.length > 0 && (
        <Link className="btn-secondary" href="/events">
          View All Events
        </Link>
      )}
    </Layout>
  );
}

export async function getStaticProps() {
  const res = await fetch(`${API_URL}/event`);
  const event = await res.json();

  return {
    props: { event: event.slice(0, 3) },
    revalidate: 1,
  };
}
