#!/bin/bash

# Configuration
API_URL="http://127.0.0.1:8080/api/v1"
DB_NAME="news_portal"
DB_USER="postgres"

echo "🚀 Starting Data Seed..."

# 1. Create Categories via SQL
echo "📁 Creating Categories..."
docker exec news_portal_db psql -U $DB_USER -d $DB_NAME -c "INSERT INTO categories (name, name_bn, slug) VALUES ('Bangladesh', 'বাংলাদেশ', 'bangladesh'), ('International', 'আন্তর্জাতিক', 'international'), ('Sports', 'খেলা', 'sports'), ('Entertainment', 'বিনোদন', 'entertainment') ON CONFLICT (slug) DO NOTHING;"

# 2. Get Admin Token
# Assuming the user created an admin with these credentials via 'make create-admin'
echo "🔑 Logging in as admin..."
LOGIN_RESPONSE=$(curl -s -L -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@news.com", "password": "password123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -oP '(?<="token":")[^"]+')

if [ -z "$TOKEN" ]; then
    echo "❌ Error: Could not get auth token."
    echo "Response from server: $LOGIN_RESPONSE"
    echo "Did you run 'make create-admin' with admin@news.com/password123?"
    exit 1
fi

# 3. Get Category IDs
echo "🔍 Fetching Category IDs..."
CATEGORIES=$(curl -s -X GET $API_URL/categories)

CAT_BD=$(echo $CATEGORIES | grep -oP '(?<={"id":")[^"]+(?=","name":"Bangladesh")')
CAT_INT=$(echo $CATEGORIES | grep -oP '(?<={"id":")[^"]+(?=","name":"International")')
CAT_SPT=$(echo $CATEGORIES | grep -oP '(?<={"id":")[^"]+(?=","name":"Sports")')
CAT_ENT=$(echo $CATEGORIES | grep -oP '(?<={"id":")[^"]+(?=","name":"Entertainment")')

# 4. Create News Articles
echo "📰 Creating News Articles..."

IMAGE_URL="https://t3.ftcdn.net/jpg/07/42/45/96/360_F_742459622_0oZNXLcUymp6BYRgvmRLuNvanbzIuXa9.jpg"

# Function to create news (using SEED endpoint)
create_news() {
    local cat_id=$1
    local title=$2
    local excerpt=$3
    local content=$4
    local featured=$5

    curl -s -X POST $API_URL/SEED_news \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{
        \"category_id\": \"$cat_id\",
        \"title\": \"$title\",
        \"excerpt\": \"$excerpt\",
        \"content\": \"$content\",
        \"thumbnail_url\": \"$IMAGE_URL\",
        \"is_featured\": $featured
      }"
}

# --- Bangladesh ---
create_news "$CAT_BD" "Digital Bangladesh: New Tech Hub Inauguration in Dhaka" "Technology sector receives major boost with world-class facilities." "<p>The Prime Minister inaugurated a cutting-edge technology hub in Dhaka today, marking a significant milestone in the Digital Bangladesh initiative. The facility will house over 50 tech startups and provide training for thousands of young entrepreneurs.</p><p>This development is expected to create more than 10,000 jobs in the technology sector over the next two years.</p>" "true"
create_news "$CAT_BD" "ঢাকা-চট্টগ্রাম হাইওয়েতে নতুন টোল সিস্টেম চালু" "স্বয়ংক্রিয় টোল প্লাজা যানজট কমাবে উল্লেখযোগ্যভাবে।" "<p>সড়ক পরিবহন মন্ত্রণালয় ঢাকা-চট্টগ্রাম মহাসড়কে আধুনিক ইলেকট্রনিক টোল কালেকশন সিস্টেম চালু করেছে।</p><p>এই প্রযুক্তি ব্যবহার করে যানবাহনগুলো থামা ছাড়াই টোল প্রদান করতে পারবে, যা যানজট উল্লেখযোগ্যভাবে হ্রাস করবে।</p>" "false"
create_news "$CAT_BD" "বাংলাদেশে রেকর্ড রপ্তানি আয়" "চলতি অর্থবছরে ৫০ বিলিয়ন ডলার অতিক্রম করেছে রপ্তানি।" "<p>Bangladesh has achieved a historic milestone by crossing \$50 billion in export earnings this fiscal year. The ready-made garment sector continues to be the leading contributor, while pharmaceutical and IT exports show promising growth.</p><p>এই সাফল্য দেশের অর্থনৈতিক স্থিতিশীলতা এবং আন্তর্জাতিক বাজারে প্রতিযোগিতার ক্ষমতা প্রমাণ করে।</p>" "false"

# --- International ---
create_news "$CAT_INT" "Global Climate Summit 2026: Major Agreements Reached" "World leaders commit to ambitious carbon reduction targets." "<p>The Global Climate Summit concluded today with unprecedented agreements on carbon emission reductions. Over 150 countries have pledged to achieve net-zero emissions by 2050.</p><p>The summit also announced a \$500 billion green technology fund to support developing nations in their transition to renewable energy.</p>" "true"
create_news "$CAT_INT" "নতুন মহাকাশ স্টেশন নির্মাণে বৈশ্বিক সহযোগিতা" "চাঁদে মানব বসতি স্থাপনের পরিকল্পনা এগিয়ে চলছে।" "<p>International Space Agency has announced a collaborative project involving 30 countries to build a permanent research station on the Moon by 2030.</p><p>এই প্রকল্পে বাংলাদেশও অংশীদার হিসেবে যুক্ত হয়েছে এবং উপগ্রহ প্রযুক্তি ও ডেটা বিশ্লেষণে অবদান রাখবে।</p>" "false"
create_news "$CAT_INT" "Tech Giants Announce Revolutionary AI Breakthrough" "New artificial intelligence system passes comprehensive reasoning tests." "<p>Leading technology companies unveiled a groundbreaking AI system capable of complex reasoning and problem-solving. The system demonstrates human-level performance in multiple domains including science, mathematics, and creative tasks.</p><p>Experts believe this advancement will transform industries ranging from healthcare to education within the next decade.</p>" "false"

# --- Sports ---
create_news "$CAT_SPT" "বাংলাদেশ ক্রিকেট দল এশিয়া কাপ ফাইনালে" "ভারতকে হারিয়ে ফাইনালে উঠল টাইগাররা।" "<p>Bangladesh cricket team secured their place in the Asia Cup final after a thrilling victory against India. Shakib Al Hasan's brilliant all-round performance and Mushfiqur Rahim's match-winning innings led the team to this historic achievement.</p><p>ফাইনাল ম্যাচ আগামী শুক্রবার পাকিস্তানের বিপক্ষে অনুষ্ঠিত হবে।</p>" "true"
create_news "$CAT_SPT" "Football World Cup Qualifiers: Exciting Matches Ahead" "Asian zone qualifiers enter crucial stage with tight competition." "<p>The FIFA World Cup Asian qualifiers have reached a decisive phase with several teams vying for limited spots. Bangladesh showed remarkable improvement, securing important points against higher-ranked opponents.</p><p>দলের নতুন কোচের কৌশল এবং তরুণ খেলোয়াড়দের দুর্দান্ত পারফরম্যান্স আশার আলো দেখাচ্ছে।</p>" "false"
create_news "$CAT_SPT" "Olympics 2026: New Sports Added to the Program" "Esports and drone racing make Olympic debut." "<p>The International Olympic Committee announced the inclusion of esports and drone racing in the 2026 Summer Olympics. This marks a significant shift in recognizing modern competitive activities as legitimate Olympic sports.</p><p>বাংলাদেশের ই-স্পোর্টস খেলোয়াড়রা অলিম্পিকে অংশগ্রহণের জন্য প্রস্তুতি শুরু করেছে।</p>" "false"

# --- Entertainment ---
create_news "$CAT_ENT" "ঢালিউডের নতুন ছবি আন্তর্জাতিক উৎসবে পুরস্কার জিতল" "স্বাধীনতা যুদ্ধভিত্তিক ছবি বিশ্বজুড়ে প্রশংসিত।" "<p>A Bangladeshi film based on the Liberation War won the prestigious Best Feature Film award at an international film festival. The movie, directed by a young filmmaker, portrays the untold stories of freedom fighters with stunning cinematography.</p><p>এই সাফল্য বাংলাদেশী চলচ্চিত্র শিল্পের জন্য একটি গুরুত্বপূর্ণ মাইলফলক এবং আন্তর্জাতিক মঞ্চে দেশের সফট পাওয়ার বৃদ্ধি করবে।</p>" "true"
create_news "$CAT_ENT" "Bollywood Meets Hollywood: Historic Collaboration Announced" "Mega budget production to feature international star cast." "<p>In a groundbreaking announcement, major production houses from Bollywood and Hollywood revealed plans for a billion-dollar epic film. The movie will feature A-list actors from both industries and will be shot across multiple continents.</p><p>ছবিটির একটি বড় অংশ বাংলাদেশে শুটিং করা হবে, যা দেশের পর্যটন শিল্পে ইতিবাচক প্রভাব ফেলবে।</p>" "false"
create_news "$CAT_ENT" "Music Festival 2026: Biggest Concert in South Asia" "International and local artists to perform at mega event." "<p>The much-anticipated Music Festival 2026 will bring together renowned artists from around the world. The three-day event promises an unforgettable experience with diverse genres including rock, pop, folk, and electronic music.</p><p>বাংলাদেশী শিল্পীরাও এই উৎসবে অংশগ্রহণ করবে এবং বিশ্ব মঞ্চে দেশের সঙ্গীত ঐতিহ্য তুলে ধরবে।</p>" "false"

echo "✅ Seeding Complete! Enjoy your live News Portal."
