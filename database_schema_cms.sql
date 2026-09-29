-- ========================================================
-- Aura / BPAS CMS Database Migration Script
-- Database: bpas_v6_8_9_db (or aura_v1_db)
-- Supports bilingual content (English & Khmer)
-- ========================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Table structure for `bpas_cms_site_settings`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bpas_cms_site_settings` (
  `id` int(11) NOT NULL PRIMARY KEY DEFAULT 1,
  `site_name_en` varchar(150) NOT NULL DEFAULT 'Aura Global',
  `site_name_km` varchar(150) NOT NULL DEFAULT 'អូរ៉ា គ្លូប៊ល',
  `tagline_en` varchar(255) DEFAULT 'Artisan Coffee, Culinary Delights & Modern Lifestyle',
  `tagline_km` DEFAULT 'កាហ្វេរសជាតិដើម អាហារឆ្ងាញ់ និងទាន់សម័យ',
  `logo_url` varchar(255) DEFAULT 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&q=80',
  `favicon_url` varchar(255) DEFAULT '/favicon.ico',
  `phone` varchar(60) DEFAULT '+855 12 345 678',
  `phone_secondary` varchar(60) DEFAULT '+855 23 999 888',
  `email` varchar(120) DEFAULT 'contact@auraglobal.com',
  `address_en` text DEFAULT 'No. 128, Preah Norodom Blvd, Phnom Penh, Cambodia',
  `address_km` text DEFAULT 'អគារលេខ ១២៨ មហាវិថីព្រះនរោត្តម រាជធានីភ្នំពេញ កម្ពុជា',
  `google_maps_iframe` text,
  `social_facebook` varchar(255) DEFAULT 'https://facebook.com/auraglobal',
  `social_telegram` varchar(255) DEFAULT 'https://t.me/auraglobal_kh',
  `social_instagram` varchar(255) DEFAULT 'https://instagram.com/auraglobal',
  `social_tiktok` varchar(255) DEFAULT 'https://tiktok.com/@auraglobal',
  `footer_text_en` text DEFAULT '© 2026 Aura Global Group. All rights reserved.',
  `footer_text_km` text DEFAULT '© ២០២៦ អូរ៉ា គ្លូប៊ល គ្រុប។ រក្សាសិទ្ធិគ្រប់យ៉ាង។',
  `seo_meta_title` varchar(255) DEFAULT 'Aura Global - Premium Coffee & Lifestyle Experience',
  `seo_meta_description` text DEFAULT 'Discover exceptional specialty coffee, chef-crafted menus, and lifestyle community with Aura Global.',
  `seo_keywords` varchar(255) DEFAULT 'aura coffee, phnom penh coffee, brunch, artisan cafe, bakery cambodia',
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `bpas_cms_site_settings` (`id`, `site_name_en`, `site_name_km`, `tagline_en`, `tagline_km`, `phone`, `email`, `address_en`, `address_km`)
VALUES (1, 'Aura Global', 'អូរ៉ា គ្លូប៊ល', 'Artisan Coffee, Culinary Delights & Modern Lifestyle', 'កាហ្វេរសជាតិដើម អាហារឆ្ងាញ់ និងទាន់សម័យ', '+855 12 345 678', 'contact@auraglobal.com', 'No. 128, Preah Norodom Blvd, Phnom Penh, Cambodia', 'អគារលេខ ១២៨ មហាវិថីព្រះនរោត្តម រាជធានីភ្នំពេញ កម្ពុជា')
ON DUPLICATE KEY UPDATE `site_name_en` = VALUES(`site_name_en`);

-- --------------------------------------------------------
-- Table structure for `bpas_cms_menus`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bpas_cms_menus` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `parent_id` int(11) NULL,
  `title_en` varchar(100) NOT NULL,
  `title_km` varchar(100) DEFAULT NULL,
  `url` varchar(255) NOT NULL,
  `target` varchar(20) DEFAULT '_self',
  `location` enum('header', 'footer_quick_links', 'footer_services') DEFAULT 'header',
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `bpas_cms_menus` (`id`, `title_en`, `title_km`, `url`, `location`, `sort_order`, `is_active`) VALUES
(1, 'Home', 'ទំព័រដើម', '/', 'header', 1, 1),
(2, 'Menu & Products', 'ម៉ឺនុយ និងផលិតផល', '/shop', 'header', 2, 1),
(3, 'Articles & News', 'អត្ថបទ និងព័ត៌មាន', '/learn', 'header', 3, 1),
(4, 'Community', 'សហគមន៍', '/community', 'header', 4, 1),
(5, 'About Aura', 'អំពីអូរ៉ា', '/pages/about', 'footer_quick_links', 1, 1),
(6, 'Terms & Conditions', 'លក្ខខណ្ឌប្រើប្រាស់', '/pages/terms', 'footer_quick_links', 2, 1),
(7, 'Privacy Policy', 'គោលការណ៍ឯកជនភាព', '/pages/privacy', 'footer_quick_links', 3, 1);

-- --------------------------------------------------------
-- Table structure for `bpas_cms_hero_slides`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bpas_cms_hero_slides` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `badge_en` varchar(60) DEFAULT '✨ NEW HARVEST 2026',
  `badge_km` varchar(60) DEFAULT '✨ ការប្រមូលផលថ្មី ២០២៦',
  `title_en` varchar(200) NOT NULL,
  `title_km` varchar(200) DEFAULT NULL,
  `subtitle_en` text,
  `subtitle_km` text,
  `button_text_en` varchar(60) DEFAULT 'Explore Menu',
  `button_text_km` varchar(60) DEFAULT 'ស្វែងរកម៉ឺនុយ',
  `button_url` varchar(255) DEFAULT '/shop',
  `image_url` varchar(255) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `bpas_cms_hero_slides` (`id`, `badge_en`, `badge_km`, `title_en`, `title_km`, `subtitle_en`, `subtitle_km`, `button_text_en`, `button_text_km`, `button_url`, `image_url`, `sort_order`) VALUES
(1, '✨ SPECIALTY ROAST', '✨ កាហ្វេលំដាប់ខ្ពស់', 'Experience Pure Artisan Flavor', 'ពិសាជាមួយរសជាតិកាហ្វេដ៏ពិតប្រាកដ', 'Handcrafted espresso, rare single-origin roasts, and fresh artisan pastries made daily.', 'កាហ្វេប្រណិត គ្រាប់កាហ្វេពិសេស និងនំបុ័ងដុតថ្មីៗជារៀងរាល់ថ្ងៃ។', 'Order Now', 'កុម្ម៉ង់ឥឡូវនេះ', '/shop', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80', 1),
(2, '🌿 BOTANICAL INFUSIONS', '🌿 តែរុក្ខជាតិធម្មជាតិ', 'Uji Ceremonial Matcha & Cold Brews', 'តែបៃតងម៉ាត់ឆាអ៊ូជី និងកាហ្វេត្រជាក់', 'Whisked to velvety perfection with organic oat milk and house-made vanilla bean syrup.', 'កូរយ៉ាងម៉ត់ខៃជាមួយទឹកដោះគោអូត និងស៊ីរ៉ូវ៉ានីឡាធម្មជាតិ។', 'Browse Drinks', 'មើលបញ្ជីភេសជ្ជៈ', '/shop', 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=1200&q=80', 2);

-- --------------------------------------------------------
-- Table structure for `bpas_cms_pages`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bpas_cms_pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `slug` varchar(120) NOT NULL UNIQUE,
  `title_en` varchar(200) NOT NULL,
  `title_km` varchar(200) DEFAULT NULL,
  `content_en` longtext NOT NULL,
  `content_km` longtext,
  `featured_image` varchar(255) DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `status` enum('published','draft') DEFAULT 'published',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `bpas_cms_pages` (`id`, `slug`, `title_en`, `title_km`, `content_en`, `content_km`, `status`) VALUES
(1, 'about', 'Our Journey & Story', 'ដំណើររឿង និងប្រវត្តិរបស់យើង', '<p>Founded in Phnom Penh, Aura Global bridges the rich traditions of coffee craftsmanship with modern culinary aesthetics. Every bean is carefully selected from sustainable highland farms.</p>', '<p>បង្កើតឡើងនៅរាជធានីភ្នំពេញ អូរ៉ា គ្លូប៊ល រួមបញ្ចូលគ្នានូវសិល្បៈកាហ្វេប្រពៃណី និងភាពច្នៃប្រឌិតទាន់សម័យ។ គ្រាប់កាហ្វេនីមួយៗត្រូវបានជ្រើសរើសយ៉ាងយកចិត្តទុកដាក់ពីកសិដ្ឋានតំបន់ខ្ពង់រាប។</p>', 'published'),
(2, 'terms', 'Terms & Conditions', 'លក្ខខណ្ឌប្រើប្រាស់', '<p>Please read our terms of service before using our website, ordering via Telegram Mini App, or dining at our stores.</p>', '<p>សូមអានលក្ខខណ្ឌនៃការប្រើប្រាស់មុនពេលបញ្ជាទិញ ឬប្រើប្រាស់សេវាកម្មរបស់យើង។</p>', 'published'),
(3, 'privacy', 'Privacy Policy', 'គោលការណ៍ឯកជនភាព', '<p>We protect your personal data with utmost discretion and security.</p>', '<p>យើងប្តេជ្ញាការពារទិន្នន័យផ្ទាល់ខ្លួន និងព័ត៌មានរបស់អ្នកដោយសុវត្ថិភាពខ្ពស់បំផុត។</p>', 'published');

-- --------------------------------------------------------
-- Table structure for `bpas_cms_blog_categories`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bpas_cms_blog_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `slug` varchar(100) NOT NULL UNIQUE,
  `name_en` varchar(120) NOT NULL,
  `name_km` varchar(120) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `bpas_cms_blog_categories` (`id`, `slug`, `name_en`, `name_km`, `sort_order`) VALUES
(1, 'coffee-culture', 'Coffee Culture', 'វប្បធម៌កាហ្វេ', 1),
(2, 'brewing-guides', 'Brewing Guides', 'វិធីឆុងកាហ្វេ', 2),
(3, 'announcements', 'Announcements & Events', 'សេចក្តីជូនដំណឹង និងព្រឹត្តិការណ៍', 3);

-- --------------------------------------------------------
-- Table structure for `bpas_cms_posts`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bpas_cms_posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `category_id` int(11) DEFAULT NULL,
  `slug` varchar(160) NOT NULL UNIQUE,
  `title_en` varchar(255) NOT NULL,
  `title_km` varchar(255) DEFAULT NULL,
  `excerpt_en` text,
  `excerpt_km` text,
  `body_en` longtext NOT NULL,
  `body_km` longtext,
  `cover_image` varchar(255) DEFAULT NULL,
  `author_name` varchar(100) DEFAULT 'Aura Roasters',
  `tags` varchar(255) DEFAULT 'Coffee, Artisan, Guide',
  `status` enum('published','draft') DEFAULT 'published',
  `views_count` int(11) DEFAULT 0,
  `published_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `bpas_cms_blog_categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `bpas_cms_posts` (`id`, `category_id`, `slug`, `title_en`, `title_km`, `excerpt_en`, `excerpt_km`, `body_en`, `body_km`, `cover_image`) VALUES
(1, 1, 'mastering-v60-pourover', 'The Art of Pour-Over Coffee: Step-by-Step V60 Ritual', 'សិល្បៈនៃការឆុងកាហ្វេ V60 ដោយដៃ', 'Unlock vibrant floral notes and crisp citrus acidity with this essential pour-over ratio guide.', 'ស្វែងយល់ពីក្បួនឆុងកាហ្វេដ៏ឈ្ងុយឆ្ងាញ់ជាមួយសមាមាត្រកាហ្វេ និងទឹកដ៏ត្រឹមត្រូវ។', '<p>To achieve the clearest cup, maintain a 1:16 brew ratio with water heated to 93°C. Pour with circular motions, allowing a 45-second bloom phase.</p>', '<p>ដើម្បីទទួលបានកាហ្វេដែលមានរសជាតិឆ្ងាញ់ សូមប្រើសមាមាត្រ ១:១៦ ជាមួយទឹកក្តៅ ៩៣ អង្សាសេ ហើយរង់ចាំ ៤៥ វិនាទីក្នុងដំណាក់កាលទីមួយ។</p>', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'),
(2, 2, 'origin-of-our-mondulkiri-beans', 'From Plantation to Cup: Sustainable Beans from Mondulkiri', 'ពីចម្ការមកកាន់ពែងកាហ្វេ៖ គ្រាប់កាហ្វេមណ្ឌលគិរី', 'Discover how our partnership with local farmers in Mondulkiri brings ethical Arabica straight to you.', 'ស្វែងយល់ពីកិច្ចសហការជាមួយកសិករនៅខេត្តមណ្ឌលគិរីដើម្បីនាំយកកាហ្វេធម្មជាតិពិតៗ។', '<p>Nestled at 800m altitude, the volcanic soil of Mondulkiri yields rich chocolate undertones and naturally low acidity.</p>', '<p>ដីភ្នំភ្លើងដ៏មានជីជាតិនៅខេត្តមណ្ឌលគិរី ផ្តល់នូវគ្រាប់កាហ្វេរសជាតិឈ្ងុយ និងមានគុណភាពខ្ពស់។</p>', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80');

-- --------------------------------------------------------
-- Table structure for `bpas_cms_team_members`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bpas_cms_team_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(100) NOT NULL,
  `position_en` varchar(100) NOT NULL,
  `position_km` varchar(100) DEFAULT NULL,
  `bio_en` text,
  `bio_km` text,
  `photo_url` varchar(255) NOT NULL,
  `social_telegram` varchar(255) DEFAULT NULL,
  `social_linkedin` varchar(255) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `bpas_cms_team_members` (`id`, `name`, `position_en`, `position_km`, `photo_url`, `sort_order`) VALUES
(1, 'Sophea Kim', 'Head Barista & Roaster', 'ប្រធានអ្នកឆុងកាហ្វេ និងលីងគ្រាប់', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 1),
(2, 'David Chen', 'Executive Pastry Chef', 'មេចុងភៅនំបុ័ងជាន់ខ្ពស់', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 2),
(3, 'Chanthou Meas', 'Operations & Quality Director', 'នាយិកាប្រតិបត្តិការ និងគុណភាព', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', 3);

-- --------------------------------------------------------
-- Table structure for `bpas_cms_testimonials`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bpas_cms_testimonials` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `author_name` varchar(100) NOT NULL,
  `author_role_en` varchar(100) DEFAULT 'Food & Lifestyle Critic',
  `author_role_km` varchar(100) DEFAULT 'អ្នករិះគន់អាហារ',
  `avatar_url` varchar(255) DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  `rating` int(11) DEFAULT 5,
  `quote_en` text NOT NULL,
  `quote_km` text,
  `is_approved` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `bpas_cms_testimonials` (`id`, `author_name`, `rating`, `quote_en`, `quote_km`, `sort_order`) VALUES
(1, 'Kosal Chea', 5, 'The best flat white in Phnom Penh hands down. The cozy ambience and friendly staff make it my daily remote office.', 'កាហ្វេ Flat White ឆ្ងាញ់ដាច់គេនៅភ្នំពេញ បរិយាកាសស្ងប់ស្ងាត់ល្អសម្រាប់ធ្វើការងារ។', 1),
(2, 'Jessica Taylor', 5, 'Their pastries are authentic French caliber. The almond croissant paired with cold brew is pure bliss!', 'នំបុ័ង Croissant រសជាតិដើមបារាំងពិតៗ ញ៉ាំជាមួយកាហ្វេត្រជាក់ពិតជាត្រូវគ្នាណាស់។', 2);

-- --------------------------------------------------------
-- Table structure for `bpas_cms_faqs`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bpas_cms_faqs` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `category` varchar(80) DEFAULT 'General',
  `question_en` text NOT NULL,
  `question_km` text,
  `answer_en` longtext NOT NULL,
  `answer_km` longtext,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `bpas_cms_faqs` (`id`, `category`, `question_en`, `question_km`, `answer_en`, `answer_km`, `sort_order`) VALUES
(1, 'Ordering', 'Can I order via Telegram without downloading an app?', 'តើខ្ញុំអាចកុម្ម៉ង់តាមតេឡេក្រាមបានទេ?', 'Yes! Our Telegram Mini App opens instantly inside Telegram with zero installation, supporting real-time tracking and ABA KHQR pay.', 'ពិតជាបាន! លោកអ្នកអាចកុម្ម៉ង់ផ្ទាល់តាម Telegram Mini App ដោយមិនបាច់ដំឡើងកម្មវិធីបន្ថែម និងគាំទ្រការទូទាត់តាម ABA KHQR។', 1),
(2, 'Dietary', 'Do you offer non-dairy milk options?', 'តើហាងមានជម្រើសទឹកដោះគោរុក្ខជាតិដែរឬទេ?', 'We proudly offer high-grade barista oat milk, almond milk, and soy milk across all espresso and tea beverages.', 'យើងមានទឹកដោះគោអូត (Oat Milk) ទឹកដោះគោអាល់ម៉ុន និងទឹកដោះសណ្ដែកសៀងសម្រាប់ភេសជ្ជៈទាំងអស់។', 2);

-- --------------------------------------------------------
-- Table structure for `bpas_cms_partners`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bpas_cms_partners` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(120) NOT NULL,
  `logo_url` varchar(255) NOT NULL,
  `website_url` varchar(255) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `bpas_cms_partners` (`id`, `name`, `logo_url`, `sort_order`) VALUES
(1, 'ABA Bank KHQR', 'https://upload.wikimedia.org/wikipedia/commons/4/4b/ABA_Bank_logo.png', 1),
(2, 'Specialty Coffee Association', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=200&q=80', 2);

-- --------------------------------------------------------
-- Table structure for `bpas_cms_contact_messages`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bpas_cms_contact_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(100) NOT NULL,
  `email` varchar(120) NOT NULL,
  `phone` varchar(60) DEFAULT NULL,
  `subject` varchar(200) DEFAULT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `admin_reply` text DEFAULT NULL,
  `replied_at` datetime DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `bpas_cms_newsletter_subscribers`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bpas_cms_newsletter_subscribers` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `email` varchar(120) NOT NULL UNIQUE,
  `status` enum('subscribed','unsubscribed') DEFAULT 'subscribed',
  `subscribed_at` timestamp DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `bpas_cms_media_assets`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bpas_cms_media_assets` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `mime_type` varchar(80) DEFAULT NULL,
  `file_size` int(11) DEFAULT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;
