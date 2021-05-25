const config = {
  siteTitle: "Kartik Gola", // Site title.
  siteTitleShort: "Kartik Gola", // Short site title for homescreen (PWA). Preferably should be under 12 characters to prevent truncation.
  siteTitleAlt: "Kartik Gola", // Alternative site title for SEO.,
  siteLogo: "/logos/logo-500.png", // Logo used for SEO and manifest.
  siteProfilePicture: "/img/kartikgola.jpg",
  siteUrl: "https://kartikgola.com", // Domain of your website without pathPrefix.
  pathPrefix: "/", // Prefixes all links. For cases when deployed to example.github.io/gatsby-advanced-starter/.
  siteDescription: "Kartik Gola", // Website description used for RSS feeds/meta description tag.
  siteRss: "/rss.xml", // Path to the RSS file.
  siteRssTitle: "Kartik Gola", // Title of the RSS feed
  siteFBAppID: "", // FB Application ID for using app insights
  googleAnalyticsID: "UA-167858369-2", // GA tracking ID.
  disqusShortname: "", // Disqus shortname.
  dateFromFormat: "DD-MM-YYYY", // Date format used in the frontmatter.
  dateFormat: "DD/MM/YYYY", // Date format for display.
  postsPerPage: 4, // Amount of posts displayed per listing page.
  userName: "kartikgola", // Username to display in the author segment.
  userEmail: "krtkgla@gmail.com", // Email used for RSS feed's author segment
  userTwitter: "iamkartikgola", // Optionally renders "Follow Me" in the UserInfo segment.
  userLocation: "India, Earth", // User location to display in the author segment.
  userAvatar: "https://api.adorable.io/avatars/150/test.png", // User avatar to display in the author segment.
  userDescription:
    "Sometimes I write spaghetti code", // User description to display in the author segment.
  // Links to social profiles/projects you want to display in the author segment/navigation bar.
  userLinks: [
    {
      label: "LinkedIn",
      path: "/logos/social/LinkedIn.svg",
      url: "https://linkedin.com/in/kartikgola"
    },
    {
      label: "GitHub",
      path: "/logos/social/GitHub.svg",
      url: "https://github.com/kartikgola"
    },
    {
      label: "Twitter",
      path: "/logos/social/Twitter.svg",
      url: "https://twitter.com/iamkartikgola"
    },
    {
      label: "Email",
      path: "/logos/social/Email.svg",
      url: "mailto:krtkgla@gmail.com"
    },
  ],
  copyright: "© kartikgola.com | 2021", // Copyright string for the footer of the website and RSS feed.
  themeColor: "#c62828", // Used for setting manifest and progress theme colors.
  backgroundColor: "#e0e0e0" // Used for setting manifest background color.
};

// Validate

// Make sure pathPrefix is empty if not needed
if (config.pathPrefix === "/") {
  config.pathPrefix = "";
} else {
  // Make sure pathPrefix only contains the first forward slash
  config.pathPrefix = `/${config.pathPrefix.replace(/^\/|\/$/g, "")}`;
}

// Make sure siteUrl doesn't have an ending forward slash
if (config.siteUrl.substr(-1) === "/")
  config.siteUrl = config.siteUrl.slice(0, -1);

// Make sure siteRss has a starting forward slash
if (config.siteRss && config.siteRss[0] !== "/")
  config.siteRss = `/${config.siteRss}`;

module.exports = config;
