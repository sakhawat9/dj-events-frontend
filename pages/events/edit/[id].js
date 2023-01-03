import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";
import styles from "@/styles/Form.module.css";
import Image from "next/image";
import { useFormik } from "formik";

export default function EditEventPage({ evt }) {
  const { name, performers, venue, address, date, time, description, image } =
    evt.data.attributes;
  let router = useRouter();
  const formik = useFormik({
    initialValues: {
      name: name,
      performers: performers,
      venue: venue,
      address: address,
      date: date,
      time: time,
      description: description,
    },

    onSubmit: async (values) => {
      const formData = new FormData();
      const data = {
        name: values.name,
        performers: values.performers,
        venue: values.venue,
        address: values.address,
        date: values.date,
        time: values.time,
        description: values.description,
      };

      // Validation
      const hasEmptyFields = Object.values(values).some(
        (element) => element === ""
      );

      if (hasEmptyFields) {
        toast.error("Please fill in all fields");
      }
      formData.append("data", JSON.stringify(data));

      //image-file
      formData.append("files.image", values.imageFile);

      //for upload page
      const uploadData = new FormData();
      uploadData.append("files", values.imageFile);

      //update collection
      const res = await fetch(
        `http://localhost:1337/api/events/${evt.data.id}`,
        {
          method: "PUT",
          body: formData,
          headers: {},
        }
      );

      if (!res.ok) {
        if (res.status === 403 || res.status === 401) {
          toast.error("No token included");
          return;
        }
        toast.error("Something Went Wrong");
      } else {
        const evt = await res.json();
        router.push(`/events/${evt.data.attributes.slug}`);
      }
      //upload file to uploads
      const uploadFile = await fetch("http://localhost:1337/api/upload", {
        method: "POST",
        body: uploadData,
        headers: {},
      });
    },
  });

  const imageUpload = (e) => {
    const file = e.target.files;
    formik.setFieldValue("imageFile", file[0]);
  };

  // const [values, setValues] = useState({
  //   name: name,
  //   performers: performers,
  //   venue: venue,
  //   address: address,
  //   date: data,
  //   time: time,
  //   description: description,
  // });

  // const [imagePreview, setImagePreview] = useState(
  //   image.data !== null ? image.data?.attributes.formats.thumbnail.url : null
  // );

  // const [showModal, setShowModal] = useState(false);

  // const router = useRouter();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Validation
  //   const hasEmptyFields = Object.values(values).some(
  //     (element) => element === ""
  //   );

  //   if (hasEmptyFields) {
  //     toast.error("Please fill in all fields");
  //   }

  //   const res = await fetch(`${API_URL}/events/${evt.data.id}`, {
  //     method: "PUT",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ data: values }),
  //   });

  //   if (!res.ok) {
  //     // if (res.status === 403 || res.status === 401) {
  //     //   toast.error("No token included");
  //     //   return;
  //     // }
  //     toast.error("Something Went Wrong");
  //   } else {
  //     const evt = await res.json();
  //     router.push(`/events/${evt.data.attributes.slug}`);
  //   }
  // };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setValues({ ...values, [name]: value });
  // };

  // const imageUploaded = async (e) => {
  //   const res = await fetch(`${API_URL}/events/${evt.data.id}`);
  //   const data = await res.json();
  //   setImagePreview(image.data.attributes.formats.thumbnail.url);
  //   setShowModal(false);
  // };

  return (
    <Layout title="Add New Event">
      <Link href="/events">Go Back</Link>
      <h1>Edit Event</h1>
      <ToastContainer />
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <div>
            <label htmlFor="name">Event Name</label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
          </div>
          <div>
            <label htmlFor="performers">Performers</label>
            <input
              type="text"
              name="performers"
              id="performers"
              onChange={formik.handleChange}
              value={formik.values.performers}
            />
          </div>
          <div>
            <label htmlFor="venue">Venue</label>
            <input
              type="text"
              name="venue"
              id="venue"
              onChange={formik.handleChange}
              value={formik.values.venue}
            />
          </div>
          <div>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              name="address"
              id="address"
              onChange={formik.handleChange}
              value={formik.values.address}
            />
          </div>
          <div>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              name="date"
              id="date"
              onChange={formik.handleChange}
              value={formik.values.date}
            />
          </div>
          <div>
            <label htmlFor="time">Time</label>
            <input
              type="text"
              name="time"
              id="time"
              onChange={formik.handleChange}
              value={formik.values.time}
            />
          </div>
        </div>

        <div>
          <label htmlFor="description">Event Description</label>
          <textarea
            type="text"
            name="description"
            id="description"
            onChange={formik.handleChange}
            value={formik.values.description}
          ></textarea>
        </div>
        <div>
          <label htmlFor="image">image-file-upload</label>
          <input
            id="file"
            name="file"
            type="file"
            onChange={imageUpload}
            value={formik.values.image}
          />
        </div>
        <button className="btn" type="submit">
          Add Event
        </button>
      </form>

      <h2>Event Image</h2>
      {image.data !== null ? (
        <Image
          src={image.data.attributes.formats.thumbnail.url}
          height={100}
          width={170}
          alt={formik.values.name}
        />
      ) : (
        <div>
          <p>No image uploaded</p>
        </div>
      )}
    </Layout>
  );
}

export async function getServerSideProps({ params: { id }, req }) {
  const res = await fetch(`${API_URL}/events/${id}?populate=*`);
  const evt = await res.json();

  return {
    props: {
      evt,
    },
  };
}
