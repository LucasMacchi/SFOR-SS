import Image from "next/image";
import styles from "./page.module.css";
import sessionCheck from "@/utils/sessionCheck";
import { redirect } from "next/navigation"

export default async function Home() {

  redirect("/inicio")

}
