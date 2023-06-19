// import Search from '@/components/Search'
// import styles from './page.module.css'
import Table from "@/components/Table.jsx";
// import Button from '@/components/Button'
// import Pagination from '@/components/Pagination'

export default function Home() {
  return (
    <main className=" flex flex-col justify-center items-center ">
      <div className=" md:container p-5 ">
        <div className="max-w-[70%] mx-auto flex flex-col gap-4">
          <div>
            <Table />
          </div>
        </div>
      </div>
    </main>
  );
}
