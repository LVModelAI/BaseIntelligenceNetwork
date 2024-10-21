import LandingPage from "~/components/landing-page";
import Layout from "~/layout";
import { getStaticProps } from "~/utils";

export default function Home() {
    return (
        <>
            <Layout>
                <LandingPage />
            </Layout>
        </>
    );
}

export { getStaticProps };
