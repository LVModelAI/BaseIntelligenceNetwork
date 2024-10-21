export type SectionProps = {
    children: React.ReactNode;
    title: string;
    id?: NavItemType["name"];
};

export type HeadingProps = {
    title: string;
};

export type NavItemType = {
    url: string | null;
    name: string;
};

export type FormData = {
    name: string;
    twitter_handle: string;
    email: string;
    message: string;
};

export type ArticleResponse = {
    article_content: string;
    article_id: string;
    article_title: string;
    created_at: string;
    img: string | null;
    slug_id: string;
    type: string | null;
    written_by: string;
    banner_highlighted: boolean;
    belongs_to: string;
    thumbnail: string;
    categories: string[];
};
export type DeviceType = "mobile" | "tablet" | "desktop" | "monitor";
