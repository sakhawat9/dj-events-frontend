import { ToastContainer } from "react-toastify";
import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";
import styles from "@/styles/Event.module.css";
import EventMap from "@/components/EventMap";
import Link from "next/link";
import Image from "next/image";

export default function EventPage({ events, slug }) {
  const event = events.filter((evt) => evt?.attributes.slug === slug);
  const {attributes} = event[0];
  const {date, image, time, name, performers, venue, description, address } = attributes;

  return (
    <Layout>
      <div className={styles.event}>
        <span>
          {new Date(date).toLocaleDateString("en-US")} at {time}
        </span>
        <h1>{name}</h1>
        <ToastContainer />
        {image && (
          <div className={styles.image}>
            <Image src={image.data.attributes.url} width={960} height={600} alt={name} />
          </div>
        )}

        <h3>Performers:</h3>
        <p>{performers}</p>
        <h3>Description:</h3>
        <p>{description}</p>
        <h3>Venue: {venue}</h3>
        <p>{address}</p>

        <EventMap evt={attributes} />

        <Link className={styles.back} href="/events">
          {"<"} Go Back
        </Link>
      </div>
    </Layout>
  );
}

// export async function getStaticPaths() {
//   const res = await fetch(`${API_URL}/events`)
//   const events = await res.json()

//   const paths = events.map((evt) => ({
//     params: { slug: evt.slug },
//   }))

//   return {
//     paths,
//     fallback: true,
//   }
// }

// export async function getStaticProps({ params: { slug } }) {
//   const res = await fetch(`${API_URL}/events?slug=${slug}`)
//   const events = await res.json()

//   return {
//     props: {
//       evt: events[0],
//     },
//     revalidate: 1,
//   }
// }

export async function getServerSideProps({ query: { slug } }) {
  const res = await fetch(`${API_URL}/events?populate=*`);
  const allEvents = await res.json();
  const events = allEvents.data;

  return {
    props: {
      events,
      slug,
    },
  };
}
