import { Suspense } from "react";
import Header from "../../../components/Header";
import DiscussionsClient from "./DiscussionsClient";

export default function Discussions() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="flex flex-1 overflow-hidden" />}>
        <DiscussionsClient />
      </Suspense>
    </>
  );
}
