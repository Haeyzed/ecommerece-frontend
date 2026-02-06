/**
 * Brands Constants
 *
 * Defines status configurations, icons, and styling maps used throughout
 * the brands module for consistent UI rendering.
 *
 * @module features/brands/constants
 */

import { type BrandStatus } from "./types";

/**
 * Style mappings for Active status badges.
 * Keys match the `value` property in `activeStatuses`.
 */
export const statusTypes = new Map<BrandStatus, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
])


const LOGO_DEV_PUBLIC_KEY = process.env.NEXT_PUBLIC_LOGO_DEV_KEY || 'pk_b5C_ydQ-R_mLijujC0OvfA';

export const SAMPLE_BRANDS_CSV = `name,short_description,image_url,page_title
Adidas,Global sportswear and footwear giant,https://img.logo.dev/adidas.com?token=${LOGO_DEV_PUBLIC_KEY},Adidas Official Store
Adobe,Creative software and digital solutions,https://img.logo.dev/adobe.com?token=${LOGO_DEV_PUBLIC_KEY},Adobe Creative Cloud
Airbnb,Vacation rentals and experiences,https://img.logo.dev/airbnb.com?token=${LOGO_DEV_PUBLIC_KEY},Airbnb Bookings
Amazon,E-commerce and cloud computing leader,https://img.logo.dev/amazon.com?token=${LOGO_DEV_PUBLIC_KEY},Amazon Shop
AMD,High-performance computing and graphics,https://img.logo.dev/amd.com?token=${LOGO_DEV_PUBLIC_KEY},AMD Processors
American Express,Financial services and credit cards,https://img.logo.dev/americanexpress.com?token=${LOGO_DEV_PUBLIC_KEY},Amex Services
Apple,Innovative consumer electronics,https://img.logo.dev/apple.com?token=${LOGO_DEV_PUBLIC_KEY},Apple Products
Asus,Computer hardware and electronics,https://img.logo.dev/asus.com?token=${LOGO_DEV_PUBLIC_KEY},Asus Computers
Audi,Luxury vehicles and automobiles,https://img.logo.dev/audi.com?token=${LOGO_DEV_PUBLIC_KEY},Audi Cars
Balenciaga,Luxury fashion house,https://img.logo.dev/balenciaga.com?token=${LOGO_DEV_PUBLIC_KEY},Balenciaga Fashion
Bentley,British luxury car manufacturer,https://img.logo.dev/bentleymotors.com?token=${LOGO_DEV_PUBLIC_KEY},Bentley Motors
BMW,German luxury vehicles and motorcycles,https://img.logo.dev/bmw.com?token=${LOGO_DEV_PUBLIC_KEY},BMW Driving Machines
Boeing,Aerospace and defense corporation,https://img.logo.dev/boeing.com?token=${LOGO_DEV_PUBLIC_KEY},Boeing Aerospace
Bosch,Engineering and technology company,https://img.logo.dev/bosch.com?token=${LOGO_DEV_PUBLIC_KEY},Bosch Tools
Bose,Audio equipment manufacturer,https://img.logo.dev/bose.com?token=${LOGO_DEV_PUBLIC_KEY},Bose Sound
Burberry,British luxury fashion brand,https://img.logo.dev/burberry.com?token=${LOGO_DEV_PUBLIC_KEY},Burberry Style
Calvin Klein,Lifestyle and fashion brand,https://img.logo.dev/calvinklein.com?token=${LOGO_DEV_PUBLIC_KEY},Calvin Klein Official
Canon,Imaging and optical products,https://img.logo.dev/canon.com?token=${LOGO_DEV_PUBLIC_KEY},Canon Cameras
Cartier,French luxury goods conglomerate,https://img.logo.dev/cartier.com?token=${LOGO_DEV_PUBLIC_KEY},Cartier Jewelry
Caterpillar,Construction machinery and equipment,https://img.logo.dev/caterpillar.com?token=${LOGO_DEV_PUBLIC_KEY},Cat Equipment
Chanel,Luxury fashion and beauty,https://img.logo.dev/chanel.com?token=${LOGO_DEV_PUBLIC_KEY},Chanel Official
Chevrolet,American automobile division,https://img.logo.dev/chevrolet.com?token=${LOGO_DEV_PUBLIC_KEY},Chevy Cars
Cisco,Networking hardware and software,https://img.logo.dev/cisco.com?token=${LOGO_DEV_PUBLIC_KEY},Cisco Networking
Coca-Cola,Carbonated soft drink manufacturer,https://img.logo.dev/coca-cola.com?token=${LOGO_DEV_PUBLIC_KEY},Coca-Cola Refreshment
Converse,American shoe company,https://img.logo.dev/converse.com?token=${LOGO_DEV_PUBLIC_KEY},Converse All Star
Costco,Membership-only big-box retail,https://img.logo.dev/costco.com?token=${LOGO_DEV_PUBLIC_KEY},Costco Wholesale
Dell,Computer technology company,https://img.logo.dev/dell.com?token=${LOGO_DEV_PUBLIC_KEY},Dell Computers
DHL,International courier and mail,https://img.logo.dev/dhl.com?token=${LOGO_DEV_PUBLIC_KEY},DHL Logistics
Dior,European luxury fashion house,https://img.logo.dev/dior.com?token=${LOGO_DEV_PUBLIC_KEY},Dior Couture
Disney,Entertainment and media conglomerate,https://img.logo.dev/disney.com?token=${LOGO_DEV_PUBLIC_KEY},Disney Magic
Dolby,Audio noise reduction and encoding,https://img.logo.dev/dolby.com?token=${LOGO_DEV_PUBLIC_KEY},Dolby Audio
Domino's,Multinational pizza restaurant chain,https://img.logo.dev/dominos.com?token=${LOGO_DEV_PUBLIC_KEY},Domino's Pizza
Dropbox,File hosting service,https://img.logo.dev/dropbox.com?token=${LOGO_DEV_PUBLIC_KEY},Dropbox Storage
eBay,Online auction and shopping website,https://img.logo.dev/ebay.com?token=${LOGO_DEV_PUBLIC_KEY},eBay Marketplace
Epson,Electronics and printer manufacturer,https://img.logo.dev/epson.com?token=${LOGO_DEV_PUBLIC_KEY},Epson Printers
Estée Lauder,Prestige skincare and makeup,https://img.logo.dev/elcompanies.com?token=${LOGO_DEV_PUBLIC_KEY},Estée Lauder Beauty
FedEx,Multinational delivery services company,https://img.logo.dev/fedex.com?token=${LOGO_DEV_PUBLIC_KEY},FedEx Delivery
Ferrari,Italian luxury sports car manufacturer,https://img.logo.dev/ferrari.com?token=${LOGO_DEV_PUBLIC_KEY},Ferrari Sports Cars
Fila,Sportswear manufacturer,https://img.logo.dev/fila.com?token=${LOGO_DEV_PUBLIC_KEY},Fila Athletics
Ford,American multinational automaker,https://img.logo.dev/ford.com?token=${LOGO_DEV_PUBLIC_KEY},Ford Vehicles
Gap,Worldwide clothing and accessories retailer,https://img.logo.dev/gap.com?token=${LOGO_DEV_PUBLIC_KEY},Gap Clothing
Garmin,GPS technology for automotive and aviation,https://img.logo.dev/garmin.com?token=${LOGO_DEV_PUBLIC_KEY},Garmin GPS
Gillette,Personal care brand owned by P&G,https://img.logo.dev/gillette.com?token=${LOGO_DEV_PUBLIC_KEY},Gillette Grooming
Google,Internet-related services and products,https://img.logo.dev/google.com?token=${LOGO_DEV_PUBLIC_KEY},Google Search
GoPro,Action camera manufacturer,https://img.logo.dev/gopro.com?token=${LOGO_DEV_PUBLIC_KEY},GoPro Cameras
Gucci,Italian luxury brand of fashion,https://img.logo.dev/gucci.com?token=${LOGO_DEV_PUBLIC_KEY},Gucci Fashion
H&M,Multinational clothing retail company,https://img.logo.dev/hm.com?token=${LOGO_DEV_PUBLIC_KEY},H&M Fashion
Harley-Davidson,American motorcycle manufacturer,https://img.logo.dev/harley-davidson.com?token=${LOGO_DEV_PUBLIC_KEY},Harley Motorcycles
Heineken,Dutch brewing company,https://img.logo.dev/heineken.com?token=${LOGO_DEV_PUBLIC_KEY},Heineken Beer
Hermès,French luxury design house,https://img.logo.dev/hermes.com?token=${LOGO_DEV_PUBLIC_KEY},Hermès Paris
Honda,Automobiles and motorcycles,https://img.logo.dev/honda.com?token=${LOGO_DEV_PUBLIC_KEY},Honda Motor
HP,Information technology company,https://img.logo.dev/hp.com?token=${LOGO_DEV_PUBLIC_KEY},HP Laptops
Hyundai,Automotive manufacturer,https://img.logo.dev/hyundai.com?token=${LOGO_DEV_PUBLIC_KEY},Hyundai Auto
IBM,Computer hardware and middleware,https://img.logo.dev/ibm.com?token=${LOGO_DEV_PUBLIC_KEY},IBM Solutions
IKEA,Ready-to-assemble furniture,https://img.logo.dev/ikea.com?token=${LOGO_DEV_PUBLIC_KEY},IKEA Home
Intel,Semiconductor chip manufacturer,https://img.logo.dev/intel.com?token=${LOGO_DEV_PUBLIC_KEY},Intel Inside
Jaguar,Luxury vehicle brand,https://img.logo.dev/jaguar.com?token=${LOGO_DEV_PUBLIC_KEY},Jaguar Cars
Jeep,Brand of American automobiles,https://img.logo.dev/jeep.com?token=${LOGO_DEV_PUBLIC_KEY},Jeep 4x4
Kellogg's,Food manufacturing company,https://img.logo.dev/kelloggs.com?token=${LOGO_DEV_PUBLIC_KEY},Kellogg's Cereal
KFC,American fast food restaurant chain,https://img.logo.dev/kfc.com?token=${LOGO_DEV_PUBLIC_KEY},KFC Chicken
Kodak,Imaging and photography products,https://img.logo.dev/kodak.com?token=${LOGO_DEV_PUBLIC_KEY},Kodak Imaging
Lamborghini,Italian brand of luxury sports cars,https://img.logo.dev/lamborghini.com?token=${LOGO_DEV_PUBLIC_KEY},Lamborghini Auto
Lego,Plastic construction toys,https://img.logo.dev/lego.com?token=${LOGO_DEV_PUBLIC_KEY},Lego Bricks
Levi's,American clothing company,https://img.logo.dev/levi.com?token=${LOGO_DEV_PUBLIC_KEY},Levi's Jeans
LG,Electronics and home appliances,https://img.logo.dev/lg.com?token=${LOGO_DEV_PUBLIC_KEY},LG Electronics
Logitech,Computer peripherals and software,https://img.logo.dev/logitech.com?token=${LOGO_DEV_PUBLIC_KEY},Logitech Gear
Louis Vuitton,Luxury fashion and leather goods,https://img.logo.dev/louisvuitton.com?token=${LOGO_DEV_PUBLIC_KEY},Louis Vuitton Paris
L'Oréal,Personal care company,https://img.logo.dev/loreal.com?token=${LOGO_DEV_PUBLIC_KEY},L'Oréal Beauty
Mastercard,Financial services corporation,https://img.logo.dev/mastercard.com?token=${LOGO_DEV_PUBLIC_KEY},Mastercard Payment
McDonald's,Fast food company,https://img.logo.dev/mcdonalds.com?token=${LOGO_DEV_PUBLIC_KEY},McDonald's Burgers
Mercedes-Benz,Luxury vehicles and vans,https://img.logo.dev/mercedes-benz.com?token=${LOGO_DEV_PUBLIC_KEY},Mercedes-Benz Auto
Microsoft,Computer software and electronics,https://img.logo.dev/microsoft.com?token=${LOGO_DEV_PUBLIC_KEY},Microsoft Tech
Mitsubishi,Conglomerate of Japanese companies,https://img.logo.dev/mitsubishicars.com?token=${LOGO_DEV_PUBLIC_KEY},Mitsubishi Motors
Motorola,Telecommunications equipment,https://img.logo.dev/motorola.com?token=${LOGO_DEV_PUBLIC_KEY},Motorola Phones
NASA,Space exploration agency,https://img.logo.dev/nasa.gov?token=${LOGO_DEV_PUBLIC_KEY},NASA Space
Nescafé,Coffee brand by Nestlé,https://img.logo.dev/nescafe.com?token=${LOGO_DEV_PUBLIC_KEY},Nescafé Coffee
Nestlé,Food and drink processing conglomerate,https://img.logo.dev/nestle.com?token=${LOGO_DEV_PUBLIC_KEY},Nestlé Foods
Netflix,Streaming service and production,https://img.logo.dev/netflix.com?token=${LOGO_DEV_PUBLIC_KEY},Netflix Streaming
Nike,Footwear and apparel,https://img.logo.dev/nike.com?token=${LOGO_DEV_PUBLIC_KEY},Nike Sports
Nintendo,Video game company,https://img.logo.dev/nintendo.com?token=${LOGO_DEV_PUBLIC_KEY},Nintendo Games
Nissan,Automobile manufacturer,https://img.logo.dev/nissan-global.com?token=${LOGO_DEV_PUBLIC_KEY},Nissan Auto
Nokia,Telecommunications and consumer electronics,https://img.logo.dev/nokia.com?token=${LOGO_DEV_PUBLIC_KEY},Nokia Connecting People
Nvidia,Graphics processing units,https://img.logo.dev/nvidia.com?token=${LOGO_DEV_PUBLIC_KEY},Nvidia GeForce
Oakley,Sunglasses and optical frames,https://img.logo.dev/oakley.com?token=${LOGO_DEV_PUBLIC_KEY},Oakley Eyewear
Oracle,Database software and technology,https://img.logo.dev/oracle.com?token=${LOGO_DEV_PUBLIC_KEY},Oracle Cloud
Panasonic,Electronics corporation,https://img.logo.dev/panasonic.com?token=${LOGO_DEV_PUBLIC_KEY},Panasonic Electronics
PayPal,Online payments system,https://img.logo.dev/paypal.com?token=${LOGO_DEV_PUBLIC_KEY},PayPal Secure
Pepsi,Carbonated soft drink,https://img.logo.dev/pepsi.com?token=${LOGO_DEV_PUBLIC_KEY},Pepsi Cola
Philips,Health technology company,https://img.logo.dev/philips.com?token=${LOGO_DEV_PUBLIC_KEY},Philips Health
PlayStation,Video game brand,https://img.logo.dev/playstation.com?token=${LOGO_DEV_PUBLIC_KEY},PlayStation Gaming
Porsche,High-performance sports cars,https://img.logo.dev/porsche.com?token=${LOGO_DEV_PUBLIC_KEY},Porsche Auto
Prada,Luxury fashion house,https://img.logo.dev/prada.com?token=${LOGO_DEV_PUBLIC_KEY},Prada Milano
Puma,Athletic and casual footwear,https://img.logo.dev/puma.com?token=${LOGO_DEV_PUBLIC_KEY},Puma Sports
Ray-Ban,Sunglasses and eyeglasses,https://img.logo.dev/ray-ban.com?token=${LOGO_DEV_PUBLIC_KEY},Ray-Ban Vision
Red Bull,Energy drink company,https://img.logo.dev/redbull.com?token=${LOGO_DEV_PUBLIC_KEY},Red Bull Energy
Reebok,Fitness footwear and clothing,https://img.logo.dev/reebok.com?token=${LOGO_DEV_PUBLIC_KEY},Reebok Fitness
Rolex,Luxury watch manufacturer,https://img.logo.dev/rolex.com?token=${LOGO_DEV_PUBLIC_KEY},Rolex Watches
Samsung,Electronics conglomerate,https://img.logo.dev/samsung.com?token=${LOGO_DEV_PUBLIC_KEY},Samsung Electronics
SAP,Enterprise software,https://img.logo.dev/sap.com?token=${LOGO_DEV_PUBLIC_KEY},SAP Solutions
Shell,Oil and gas company,https://img.logo.dev/shell.com?token=${LOGO_DEV_PUBLIC_KEY},Shell Energy
Siemens,Industrial manufacturing company,https://img.logo.dev/siemens.com?token=${LOGO_DEV_PUBLIC_KEY},Siemens Engineering
Slack,Business communication platform,https://img.logo.dev/slack.com?token=${LOGO_DEV_PUBLIC_KEY},Slack Chat
Sony,Conglomerate corporation,https://img.logo.dev/sony.com?token=${LOGO_DEV_PUBLIC_KEY},Sony Entertainment
SpaceX,Aerospace manufacturer,https://img.logo.dev/spacex.com?token=${LOGO_DEV_PUBLIC_KEY},SpaceX Exploration
Spotify,Audio streaming provider,https://img.logo.dev/spotify.com?token=${LOGO_DEV_PUBLIC_KEY},Spotify Music
Starbucks,Coffeehouse chain,https://img.logo.dev/starbucks.com?token=${LOGO_DEV_PUBLIC_KEY},Starbucks Coffee
Subway,Fast food franchise,https://img.logo.dev/subway.com?token=${LOGO_DEV_PUBLIC_KEY},Subway Sandwiches
Supreme,Skateboarding lifestyle brand,https://img.logo.dev/supremenewyork.com?token=${LOGO_DEV_PUBLIC_KEY},Supreme NY
Target,Retail corporation,https://img.logo.dev/target.com?token=${LOGO_DEV_PUBLIC_KEY},Target Stores
Tesla,Electric vehicle and clean energy,https://img.logo.dev/tesla.com?token=${LOGO_DEV_PUBLIC_KEY},Tesla EV
The North Face,Outdoor recreation products,https://img.logo.dev/thenorthface.com?token=${LOGO_DEV_PUBLIC_KEY},The North Face Gear
Tiffany & Co.,Luxury jewelry and specialty retailer,https://img.logo.dev/tiffany.com?token=${LOGO_DEV_PUBLIC_KEY},Tiffany Jewelry
Timberland,Outdoors wear and footwear,https://img.logo.dev/timberland.com?token=${LOGO_DEV_PUBLIC_KEY},Timberland Boots
Toyota,Automotive manufacturer,https://img.logo.dev/toyota.com?token=${LOGO_DEV_PUBLIC_KEY},Toyota Cars
Twitter,Social networking service,https://img.logo.dev/twitter.com?token=${LOGO_DEV_PUBLIC_KEY},Twitter Social
Uber,Ride-hailing technology,https://img.logo.dev/uber.com?token=${LOGO_DEV_PUBLIC_KEY},Uber Rides
Under Armour,Footwear and sports apparel,https://img.logo.dev/underarmour.com?token=${LOGO_DEV_PUBLIC_KEY},Under Armour Sports
Unilever,Consumer goods company,https://img.logo.dev/unilever.com?token=${LOGO_DEV_PUBLIC_KEY},Unilever Products
Vans,Skateboarding shoes and apparel,https://img.logo.dev/vans.com?token=${LOGO_DEV_PUBLIC_KEY},Vans Off The Wall
Versace,Luxury fashion company,https://img.logo.dev/versace.com?token=${LOGO_DEV_PUBLIC_KEY},Versace Fashion
Visa,Financial services,https://img.logo.dev/visa.com?token=${LOGO_DEV_PUBLIC_KEY},Visa Payments
Volkswagen,Automotive manufacturing,https://img.logo.dev/vw.com?token=${LOGO_DEV_PUBLIC_KEY},Volkswagen Auto
Volvo,Luxury vehicles,https://img.logo.dev/volvocars.com?token=${LOGO_DEV_PUBLIC_KEY},Volvo Safety
Walmart,Multinational retail corporation,https://img.logo.dev/walmart.com?token=${LOGO_DEV_PUBLIC_KEY},Walmart Retail
Warner Bros,Entertainment company,https://img.logo.dev/warnerbros.com?token=${LOGO_DEV_PUBLIC_KEY},Warner Bros Studios
Whirlpool,Home appliances manufacturer,https://img.logo.dev/whirlpool.com?token=${LOGO_DEV_PUBLIC_KEY},Whirlpool Appliances
Xbox,Video gaming brand,https://img.logo.dev/xbox.com?token=${LOGO_DEV_PUBLIC_KEY},Xbox Gaming
Xerox,Print and digital document products,https://img.logo.dev/xerox.com?token=${LOGO_DEV_PUBLIC_KEY},Xerox Solutions
Yahoo,Web services provider,https://img.logo.dev/yahoo.com?token=${LOGO_DEV_PUBLIC_KEY},Yahoo Web
Yamaha,Musical instruments and electronics,https://img.logo.dev/yamaha.com?token=${LOGO_DEV_PUBLIC_KEY},Yamaha Music
YouTube,Online video sharing,https://img.logo.dev/youtube.com?token=${LOGO_DEV_PUBLIC_KEY},YouTube Videos
Zara,Clothing and accessories retailer,https://img.logo.dev/zara.com?token=${LOGO_DEV_PUBLIC_KEY},Zara Fashion
Zoom,Videotelephony software,https://img.logo.dev/zoom.us?token=${LOGO_DEV_PUBLIC_KEY},Zoom Meetings`