#!/usr/bin/env python3
"""
Deep cleanup: Remove ALL non-visitor-economy businesses.
Instead of blacklisting bad ones, we WHITELIST valid visitor categories
and remove everything else.

Per the brief, KEEP:
  Restaurants, hotels, bars, cafes, attractions, beaches/parks,
  shopping, golf, activities, wellness, transport

REMOVE:
  Everything else (B2B, medical, trades, farms, schools, etc.)
"""
import os
import re
import psycopg2
import psycopg2.extras
from dotenv import load_dotenv
from urllib.parse import urlparse

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')
conn_parsed = urlparse(DATABASE_URL)
conn = psycopg2.connect(
    host=conn_parsed.hostname, port=conn_parsed.port or 5432,
    database=conn_parsed.path.lstrip('/'),
    user=conn_parsed.username, password=conn_parsed.password,
    sslmode='require'
)

# ============================================================
# STEP 1: Define what IS visitor-relevant (whitelist approach)
# ============================================================

# Strong KEEP indicators - if name contains these, definitely keep
KEEP_PATTERNS = [
    # Food & Drink
    r'restaurant', r'ristorante', r'trattoria', r'bistro', r'brasserie',
    r'grill\b', r'kitchen\b', r'diner\b', r'steakhouse', r'smokehouse',
    r'carvery', r'taverna', r'pizzeria', r'noodle', r'sushi', r'ramen',
    r'burger', r'wings?\b', r'taco', r'shawarma', r'kebab', r'bbq',
    r'fish\s*[&+]\s*chips?', r'chippy', r'chip\s+shop', r'fish\s+bar',
    r'cafe\b', r'caff[e\u00e9]', r'coffee', r'tea\s*room',
    r'bar\b', r'pub\b', r'inn\b', r'tavern', r'lounge\b', r'ale\s*house',
    r'tapas', r'wine\s*bar', r'cocktail', r'brewery', r'micro\s*brew',
    r'bakery', r'patisserie', r'deli\b', r'delicatessen',
    r'takeaway', r'take\s*away', r'chinese\b.*(?:takeaway|restaurant)',
    r'indian\b.*(?:takeaway|restaurant|kitchen)', r'thai\b',
    r'pizza\b', r'curry\b', r'nando', r'mcdonald', r'kfc\b',
    r'subway\b', r'domino', r'costa\b', r'starbuck', r'greggs?\b',
    r'ice\s*cream', r'gelato', r'waffle', r'crepe',
    r'sandwich\b', r'panini', r'brunch', r'breakfast\b.*(?:bar|cafe|unlimited)',

    # Accommodation
    r'hotel\b', r'motel\b', r'hostel\b', r'lodge\b(?!.*joinery)',
    r'b\s*[&+]\s*b\b', r'bed\s*[&+]\s*breakfast', r'guest\s*house',
    r'apartments?\b(?!.*(?:bedroom|bed\b))', r'holiday\s*(?:park|cottage|flat)',
    r'caravan\s*(?:park|site)', r'camp\s*(?:site|ing)', r'glamping',
    r'self[- ]catering', r'travelodge', r'premier\s*inn',
    r'holiday\s*home', r'retreat\b',

    # Attractions & Entertainment
    r'museum', r'gallery\b(?!.*signwrit)', r'theatre', r'theater',
    r'cinema\b', r'bowl(?:ing)?\b', r'amuse', r'pleasure\s*land',
    r'pier\b', r'aquarium', r'zoo\b', r'model\s*village',
    r'adventure\b', r'escape\s*room', r'laser\b', r'arcade\b',
    r'mini\s*golf', r'crazy\s*golf', r'fun\s*fair', r'theme\s*park',
    r'funfair', r'waterpark', r'water\s*park', r'play\s*centre',
    r'soft\s*play', r'trampoline', r'go[\s-]?kart',
    r'botanic\b', r'botanical',

    # Outdoor & Nature
    r'beach\b', r'nature\s*reserve', r'promenade',
    r'marine\s*lake', r'pier\b', r'sand\s*dunes?',
    r'country\s*park', r'victoria\s*park',

    # Shopping & Retail
    r'shop\b', r'store\b(?!.*storage)', r'boutique', r'market\b',
    r'jeweller', r'jewelry', r'florist', r'gift\b', r'souvenir',
    r'book\s*shop', r'antique', r'vintage\b', r'charity\s*shop',
    r'clothes', r'fashion', r'footwear', r'shoe\b',
    r'supermarket', r'tesco\b(?!.*pharmacy)', r'aldi\b', r'lidl\b',
    r'morrisons?\b', r'asda\b', r'sainsbury', r'spar\b',
    r'home\s*bargain', r'b\s*[&+]\s*m\b', r'primark', r'next\b(?!.*step)',
    r'tk\s*maxx', r'wilko', r'argos\b', r'currys?\b(?!.*curry)',
    r'butcher', r'greengrocer', r'fishmonger',
    r'garden\s*centre', r'dobbies',

    # Golf
    r'golf\b',

    # Activities & Leisure
    r'leisure\b', r'gym\b', r'fitness', r'swim', r'pool\b',
    r'tennis\b', r'cricket\b', r'football\b', r'rugby\b',
    r'sailing\b', r'yacht\b', r'boat\b(?!.*building)', r'kayak',
    r'surf\b', r'cycle\b', r'cycling', r'bike\b',
    r'horse\s*rid', r'equestrian', r'livery',
    r'fish(?:ing|eries)\b', r'angling',
    r'archery', r'shooting', r'paint\s*ball',
    r'rec(?:reation)?\s*centre',

    # Wellness & Beauty (visitor-adjacent)
    r'spa\b', r'salon\b', r'barber', r'hair\s*(?:dresser|studio|cut)',
    r'beauty\b', r'nail\b', r'lash', r'brow\b',
    r'massage\b', r'facial\b', r'tattoo', r'piercing',
    r'tanning\b',

    # Transport (visitor-relevant)
    r'taxi\b', r'cab\b', r'car\s*hire', r'bus\s*(?:service|station)',
    r'train\s*station', r'ferry\b',
    r'airport\b', r'park\s*[&+]\s*ride',

    # Specific well-known businesses/chains
    r'wetherspoon', r'greene\s*king', r'marston',
    r'miller\s*[&+]\s*carter', r'harvester', r'toby\b',
    r'beefeater', r'brewers\s*fayre', r'hungry\s*horse',
    r'prezzo', r'zizzi', r'wagamama', r'nando',
    r'one\s*stop\b', r'co-?op\s*food',

    # Local landmarks/attractions
    r'southport\s*air\s*show', r'atkinson\b', r'botanic\s*garden',
    r'model\s*railway', r'lawnmower\s*museum',
    r'british\s*musical\s*fireworks', r'flower\s*show',
    r'alpine\s*village', r'eco\s*centre',

    # Specific known Southport businesses
    r'vincent\b', r'athenae', r'waterfront\b', r'scarisbrick\s*hotel',
    r'bold\s*hotel', r'prince\s*of\s*wales', r'royal\s*clifton',
    r'the\s*grand\b', r'formby\s*hall',

    # Specific valid local business names (from manual review)
    r'600\s*degrees', r'2nd\s*wife', r'5th\s*wise\s*monkey',
    r'coast\s*birkdale', r'cove\b', r'chez\s*moi', r'chop\s*house',
    r'cloud\s*9', r'beer\s*den', r'bold\s*arms', r'coronation\b(?!.*jewel|.*news)',
    r'carlton\b', r'banff\b', r'eventide', r'pebbles\b',
    r'avacardo', r'birkdale\s*tandoori', r'coopers\s*pizzacraft',
    r'aziz\s*curries', r'blenderz', r'central\s*cabs',
    r'buttylicious', r'concept\s*food', r'cornelius\s*coco',
    r'mere\s*brow\s*bar', r'mere\s*brow\s*taxi',
    r'sandon\s*crown', r'tipple\b', r'union\s*club',
    r'eventide', r'la\s*beaut', r'ocean\s*plaza',

    # More food businesses
    r'food\s*(?:bar|land|elicious|elicioud)', r'flavour',
    r'snack\b', r'spice\b', r'wok', r'slice\b',
    r'chew', r'munch', r'bites?\b', r'eater[iy]',
    r'orient\b', r'palace\b.*(?:fish|chinese|indian)',
    r'dragon\b.*(?:chinese|takeaway)', r'garden\b.*(?:chinese|fish|indian)',
    r'star\b.*(?:chinese|takeaway|fish)',
    r'lucky\b.*(?:house|garden|star)', r'jade\b',
    r'panda\b', r'rainbow\b.*(?:chinese|\d)', r'new\s*china',
    r'new\s*spring', r'new\s*sui', r'new\s*golden',
    r'new\s*cut\s*lane\s*takeaway',
    r'cleopatra\b', r'marmaris\b', r'kalash\b', r'namaste\b',
    r'limoncello\b', r'mozaa\b', r'dolce\b', r'volare\b',
    r'pomodoro\b', r'roberto', r'fellini\b', r'sicily\b',
    r'prezzo\b', r'scoozi\b', r'yo!\b',
    r'lal\s*qila', r'shamraat', r'taj\s*mahal',
    r'nellie\b', r'hanoi\b', r'korean\b', r'itsy\s*bitsy',
    r'straits\b', r'thai\s*rice', r'south\s*garden',
    r'harpers?\b.*(?:fish|chip)', r'high\s*park\s*fish',
    r'heathfield\s*takeaway', r'fylde\s*fish',
    r'harun', r'hey\s*burger', r'lansdowne\s*bistro',
    r'langberry', r'harbour\s*cafe',
    r'lansdowne\b', r'esperanto', r'lansdown',
    r'hickory', r'remedy\b', r'suzie',
    r'dirty\s*american', r'wingy\s*jack',
    r'jack(?:son)?s\b(?!.*mere)', r'wright',
    r'joarr\b', r'kellen', r'lings?\s*on\s*king',
    r'emily\b.*(?:sandwich|bar)', r'hamletts?',
    r'deli\s*(?:mio|licious|bar)', r'lourdes\s*deli',
    r'graysons?\b', r'penelope', r'toad\s*hall',
    r'silcock', r'ships?\s*wheel', r'sandgrounder',
    r'sfc\b', r'shake\s*factory', r'swan\b.*(?:restaurant|takeaway)',
    r'peperoni\b', r'sahara\b.*takeaway',
    r'sam\b.*(?:kitchen|restaurant|bar)',
    r'mr\s*(?:chips|slice)', r'midnight\b', r'master\s*mcgrath',
    r'caff', r'sundae', r'waffle\b', r'pancake',
    r'tearoom', r'tea\s*rooms?', r'witchcraft\b',

    # More pubs/bars
    r'arms\b', r'crown\b(?!.*build|.*jewel)', r'head\b(?!.*quarter)',
    r'horse\b(?!.*riding)', r'hare\b', r'fox\b(?!.*hunt)',
    r'eagle\b', r'lion\b(?!.*shop)', r'swan\b', r'anchor\b',
    r'ship\b', r'plough\b.*(?:pub|inn|bar)',
    r'imperial\b', r'richmond\b(?!.*house)',
    r'dolphin\b', r'mount\s*pleasant', r'pines\b.*bar',
    r'park\b.*(?:bar|pub|grill)', r'thatch\b',
    r'grapevine\b', r'lakeside\b.*(?:on\s*tour|bar)',
    r'kicking\s*donkey', r'legh\s*arms',
    r'marsh\s*harrier',

    # More retail/shopping
    r'boots\b', r'clarks\b', r'argos\b', r'wilkinson',
    r'poundland', r'holland\s*[&+]\s*barrett',
    r'superdrug', r'savers\b', r'bodycare\b',
    r'home\s*sense', r'the\s*range\b', r'robert\s*dyas',
    r'specsaver', r'vodafone', r'ee\b(?!.*service)',
    r'three\s*(?:mobile|store)', r'o2\b', r'sky\b.*(?:store|shop)',
    r'pet\s*shop', r'pet\s*hut', r'pet\s*store',
    r'bridal\b', r'menswear', r'womenswear',
    r'lingerie', r'jewel(?:s|ry|lers?)', r'optik',
    r'camera\b', r'photo\b.*(?:studio|graph)',
    r'card\s*(?:shop|factory)', r'clintons?\b',
    r'flowers?\b.*(?:shop|by)', r'bloom\b.*(?:by|florist)',
    r'stationery\b', r'news\s*agent',
    r'chocolate\b', r'sweet\b.*(?:shop|emporium)',

    # More attractions
    r'discovery\s*centre', r'big\s*wheel', r'cherry\s*blossom',
    r'air\s*show', r'fun(?:damental|fair)',

    # Car parks (visitor-relevant transport)
    r'car\s*park\b',

    # More accommodation
    r'cottage\b', r'manor\b(?!.*farm)', r'suite\b', r'mews\b',
    r'guest\b', r'rooms?\b(?!.*escape)',

    # Age UK / charity shops (visitor-relevant shopping)
    r'age\s*uk', r'oxfam', r'barnardo', r'british\s*heart',
    r'cancer\s*research', r'red\s*cross', r'mind\b.*(?:shop|store)',
    r'cats?\s*protection', r'pdsa\b',

    # Convenience stores
    r'premier\b.*(?:store|shop|convenience)',
    r'londis\b', r'nisa\b', r'mace\b',
    r'off\s*licen[cs]e', r'bargain\s*booze',

    # Leisure/misc
    r'travel\b', r'firework', r'souvenir', r'candle',
    r'emporium', r'den\b(?!.*tal)', r'hideaway',
]

# Strong REMOVE indicators - definitely not visitor-relevant
REMOVE_PATTERNS = [
    # B2B / Professional services
    r'accountant', r'solicitor', r'lawyer', r'barrister', r'legal\b',
    r'insurance\b', r'financial\s*(?:advisor|service|planning)',
    r'wealth\s*management', r'mortgage', r'bank\b(?!.*food)',
    r'recruit', r'staffing', r'employment', r'resourc(?:ing|e)',
    r'consult(?:ant|ing|ancy)', r'marketing\b', r'advertis',
    r'design\b(?!.*interior.*shop)', r'media\b(?!.*social)',
    r'communications?\s*ltd', r'web\s*(?:design|develop)',
    r'software\b', r'IT\s*(?:service|support|solution)',
    r'architect\b', r'surveyor', r'planning\b.*(?:service|consult)',
    r'property\s*(?:management|service|maintenance|ltd)',
    r'estate\s*agent', r'lettings?', r'conveyancing',

    # Medical / Health / Dental
    r'dental\b', r'dentist', r'surgery\b(?!.*cosmetic.*beauty)',
    r'physiotherap', r'chiropract', r'osteopath',
    r'optician', r'optic(?:al|s)\b', r'eye\s*(?:care|test|clinic)',
    r'pharmacy\b', r'chemist\b',
    r'medical\s*centre', r'health\s*centre', r'clinic\b(?!.*beauty|.*skin|.*aesthet)',
    r'(?:gp|doctor)s?\b', r'hospital\b(?!.*hotel)',
    r'veterinar', r'\bvets?\b', r'animal\s*(?:hospital|care|welfare)',
    r'dermatolog', r'podiatr', r'chiropod',
    r'mental\s*health', r'counsel(?:l|)ing\b', r'therap(?:y|ist)\b(?!.*beauty|.*massage|.*spa)',
    r'hypnotherap', r'hypno\s*(?:birth|health)',
    r'hearing\s*(?:aid|care)', r'audiol',
    r'care\s*home', r'residential\s*home', r'nursing\s*home',
    r'home\s*care\b', r'domiciliary', r'assisted\s*living',

    # Trades / Construction / Industrial
    r'plumb(?:er|ing)', r'electric(?:al|ian)\b(?!.*shop)',
    r'roofing', r'roof\s*repair', r'gutter',
    r'build(?:er|ing)\s*(?:service|maintenance|ltd|solution|work)',
    r'joinery\b', r'carpenter', r'woodwork',
    r'landscape|landscaping', r'tree\s*surgeon', r'arborist',
    r'garden(?:er|ing)\s*(?:service|maintenance)',
    r'fencing\b(?!.*sport)', r'decking\b', r'paving\b', r'tarmac',
    r'paint(?:er|ing)\b(?!.*art|.*gallery|.*ball)',
    r'plaster(?:er|ing)\b', r'render(?:ing)?\b',
    r'demolition', r'excavat', r'groundwork',
    r'scaffold', r'crane\b', r'haulage', r'skip\s*hire',
    r'waste\b.*(?:disposal|management|collect|recycl)',
    r'cleaning\s*(?:service|specialist|solution|company)',
    r'window\s*clean', r'carpet\s*clean',
    r'pest\s*control', r'drain\b.*(?:clean|unblock|service)',
    r'locksmith', r'glazing\b', r'double\s*glazing',
    r'conservator(?:y|ies)\b(?!.*bar|.*restaurant)',
    r'heating\b(?!.*restaurant)', r'gas\s*(?:service|engineer|safe)',
    r'boiler\b', r'air\s*condition',
    r'alarm\b', r'security\b(?!.*parking)', r'cctv',
    r'fire\s*(?:alarm|safety|protect|sprinkler)',
    r'forklift', r'industrial\b', r'engineering\b',
    r'manufactur', r'fabricat', r'weld(?:ing|er)',
    r'machining', r'cnc\b', r'lathe\b',
    r'warehouse\b', r'storage\b(?!.*caravan)', r'logistics',
    r'printing\b(?!.*art)', r'print\s*(?:shop|station|service)',
    r'sign\s*(?:writ|mak|age)', r'banner\b',
    r'auto\s*(?:centre|repair|body|electric|mobile)',
    r'car\s*(?:dealer|sales|repair|body|wash|valet)',
    r'garage\b(?!.*burger|.*bar)', r'mot\s*(?:centre|test|station)',
    r'tyre\b', r'exhaust\b(?!.*fan)', r'brake\b.*(?:service|repair)',
    r'towbar', r'recovery\b.*(?:vehicle|service)',
    r'van\s*(?:hire|rental|sales)', r'truck\b',
    r'shotblast', r'sandblast', r'powder\s*coat',
    r'instrument(?:ation)?s?\b(?!.*music)',
    r'electronics?\s*ltd', r'circuit\b', r'sensor\b',
    r'hydraulic', r'pneumatic', r'valve\b',
    r'chemical\b', r'solvent', r'adhesive',
    r'plastic\b(?!.*surgery.*beauty)', r'rubber\b', r'foam\b',
    r'pallet\b', r'packaging\b',

    # Agriculture / Farming
    r'\bfarm\b(?!.*shop|.*cafe|.*restaurant|.*holiday|.*cottage|.*camp|.*glamping|.*park)',
    r'nurseries?\b(?!.*day\s*nursery).*(?:plant|garden|tree|shrub|turf)',
    r'turf\s*(?:suppli|farm|grow)', r'seed\s*merchant',
    r'potato\s*merchant', r'livestock', r'agricultural\b',
    r'tractor\b', r'plough\b',

    # Schools / Education (not visitor)
    r'school\b(?!.*driving.*school)', r'academy\b(?!.*dance|.*gym|.*sport)',
    r'college\b(?!.*bar)', r'university\b',
    r'nursery\b(?!.*garden)', r'childmind', r'pre[- ]school',
    r'tutor(?:ing|ial)?', r'teach(?:er|ing)\b',
    r'training\b(?!.*gym|.*fitness)', r'coaching\b(?!.*sport|.*fitness)',

    # Religious (not visitor attractions)
    r'(?:methodist|baptist|pentecostal|evangelical)\s*church',
    r'kingdom\s*hall', r'mosque\b', r'synagogue\b',
    r'parish\s*council',

    # Government / Civic
    r'post\s*office\b', r'council\b(?!.*estate)', r'civic\b',
    r'job\s*centre', r'citizens?\s*advice', r'court\s*house',
    r'library\b(?!.*bar|.*cafe)',
    r'community\s*(?:centre|association|group|hub)',
    r'(?:water|sewage)\s*(?:treatment|works)',

    # Funeral
    r'funeral\b', r'cremator', r'memorial\s*(?:park|garden|stone)',

    # Misc non-visitor
    r'removal(?:s|ist)', r'courier\b', r'delivery\s*(?:service|company)',
    r'photobooth', r'entertainer\b',
    r'dyslexia', r'disability', r'autism',
    r'rescue\b(?!.*bar)', r'rspca\b', r'animal\s*shelter',
    r'kennels?\b', r'cattery\b', r'dog\s*(?:groom|train|walk|sit|board)',
    r'pet\s*(?:sit|care|board|cremation|groom)',
    r'PPI\b', r'debt\b', r'claim\b.*(?:company|service)',
    r'forex', r'trading\s*(?:ltd|limited|company)',
    r'energy\b.*(?:company|service|solution|consult)',
    r'solar\s*panel', r'insulation\b',
    r'rooflight', r'window\s*(?:company|install)',
    r'door\b.*(?:company|install|supply)',
    r'kitchen\b.*(?:install|company|supply|fit|bedroom)(?!.*restaurant)',
    r'bathroom\b.*(?:install|company|supply|fit)',
    r'bedroom\b.*(?:company|supply|fit)',
    r'cabinet\b', r'worktop\b',
    r'firework\b(?!.*display|.*show|.*festival)',
    r'shed\b(?!.*bar)', r'fencing\s*(?:company|supply)',

    # More B2B patterns from reviewing unknowns
    r'productions?\b(?!.*theatre)', r'sail\s*maker',
    r'pilates\b', r'cross\s*fit\b', r'kickbox',
    r'aesthetics?\b', r'permanent\s*make\s*up',
    r'teeth\s*whiten', r'cosmetic\b(?!.*shop)',
    r'cosmetics\b', r'diy\b', r'flooring\b',
    r'carpet\b(?!.*clean)', r'curtain\b', r'blind\b',
    r'upholster', r'stained\s*glass',
    r'computer\b', r'electronics?\b(?!.*shop)',
    r'\bav\b.*ltd', r'active\s*av', r'workwear',
    r'maternity\b', r'baby\b.*(?:class|cloth)',
    r'motorcycle', r'motorbike',
    r'plant\s*(?:sale|hire)', r'contracting\b',
    r'claims?\s*(?:management|company)', r'ppi\b',
    r'driving\s*school', r'tuition\b',
    r'produc(?:ts?|tion)\b(?!.*theatre|.*show)',
    r'wholesale\b', r'supplier\b', r'merchant\b',
    r'distribution\b', r'import\b.*(?:export|ltd)',
    r'assembl[ey]', r'component', r'hydraulic',
    r'solution\b.*(?:ltd|limited|company)',
    r'limited$', r'\bltd$',
    r'enterprise\b.*(?:ltd|limited)',
    r'service\b.*(?:ltd|limited|station)(?!.*restaurant|.*cafe)',
    r'associates?\b.*(?:ltd|limited)',
    r'group\b.*(?:ltd|limited)',
    r'partnership\b', r'holdings?\b',
    r'\\bllp$', r'\\bplc$',
    r'hearing\s*(?:centre|aid)', r'amplif',
    r'valet(?:ing)?', r'valeting\b',
    r'photobooth', r'photo\s*booth',
    r'hypnotherapy', r'hypnobirth',
    r'acupunctur', r'reflexolog',
    r'therapy\b(?!.*beauty|.*spa|.*massage)',
    r'counsell?ing\b', r'psycholog',
    r'coach(?:ing)?\b(?!.*house|.*travel)',
    r'classes?\b(?!.*fitness|.*dance)', r'class(?:es)?$',
    r'nurseries(?!.*garden\s*centre)', r'nursery\b(?!.*garden)',
    r'stables?\b(?!.*hotel)', r'livery\b(?!.*hotel)',
    r'farm\b(?!.*shop|.*cafe|.*restaurant|.*holiday|.*cottage|.*camp|.*glamping|.*park|.*fisheries)',
    r'memorial\b', r'monument\b',
    r'church\b(?!.*town|.*house|.*bar|.*pub)', 
    r'chapel\b(?!.*house.*bar)',
    r'cemetery\b', r'burial\b',
    r'housing\b', r'homeless\b', r'shelter\b(?!.*restaurant)',
    r'charity\b(?!.*shop)',
    r'healthcare\b', r'health\b.*(?:care|service)',
    r'welfare\b', r'social\s*(?:service|care|work)',
    r'rspca\b', r'rescue\b', r'shelter\b',
    r'dog\b.*(?:grooming|sitting|walking|training|academy)',
    r'k9\b', r'canine\b(?!.*bar)',
    r'cattery\b', r'kennel\b',
    r'vet\b(?!.*eran)', r'veterin',
]

# Names that are just place names or addresses (not businesses)
PLACE_NAMES = {
    'Banks', 'Burscough', 'Formby', 'Halsall', 'Ormskirk',
    'Scarisbrick', 'Southport', 'Birkdale', 'Ainsdale',
    'Churchtown', 'Crossens', 'Marshside', 'Blowick',
    'Damwood', 'Merlin', 'BG', 'Westwood',
}

# Patterns for non-business entries (addresses, coordinates, etc.)
NON_BUSINESS_PATTERNS = [
    r'^United Kingdom$',
    r'^\d+\s+\w+\s+(lane|road|street|avenue|drive|close|way|crescent|terrace)$',
    r'^[A-Z]{1,2}\d+\s', # Postcode-like
    r'^\d+\.\d+$',  # Coordinates
    r'^by\s+', # "by Heathey Lane" etc.
    r'^ATM\b', # ATMs
    r'^InPost\b', # Lockers
    r'^bp$', # Petrol station
    r'Charging\s*Station',
    r'War\s*Memorial$',
    r'Totem\s*Pole$',
    r'^Anchor\b(?!.*bar|.*inn|.*pub|.*restaurant)',
    r'^\w+\s+Ave$',  # "Truro Ave" etc
    r'Hundred End Lane',
    r'Dawlish Drive',
]

# Airbnb-style individual rentals (NOT actual businesses)
AIRBNB_PATTERNS = [
    r'^\d+\s*(?:br|bed)', r'bedroom\b.*(?:house|apartment|flat|bungalow|cottage)',
    r'sleeps?\s*\d+', r'one-bedroom|two-bedroom|three-bedroom|four-bedroom|five-bedroom|six-bedroom',
    r'(?:cosy|cozy|lovely|charming|comfortable|spacious|modern|stylish|luxurious)\s+\d+\s*bed',
    r'(?:cosy|cozy)\s+(?:family\s+)?home\b', r'(?:cosy|cozy)\s+\d+\s+bed\b',
    r'private\s+(?:patio|garden|bathroom|parking)',
    r'free\s+(?:parking|wifi|onsite)',
    r'(?:lake|sea|ocean|country)\s*(?:side)?\s*view',
    r'home\s+from\s+home', r'hidden\s+gem',
    r'perfect\s+for\s+(?:golf|the\s+open|family|couple)',
    r'up\s+to\s+\d+\s+guest',
    r'Double\s+Room\s+with\s+(?:Private|Shared|En)',
    r'Executive\s+Triple\s+Room',
    r'Deluxe\s+(?:Double|Twin|Single|Triple|Apartment)',
    r'(?:ensuite|en-suite)\s+(?:room|with)',
    r'\bwith\s+(?:Hot\s+Tub|Shower|Bath)\b',
    r'Newly\s+Refurb', r'newly\s+renovated',
    r'Your\s+Home\s+in', r'home\s+in\s+(?:the\s+)?(?:heart|centre)',
    r'\bApartment\s*(?:in|near)\b',
]

# PROTECTED: Known good businesses that might match remove patterns
PROTECTED = {
    'The Stamford Southport',  # Wetherspoons pub
    'Southport Air Show',
    'Southport Eco Centre',
    'Southport Sailing Club',
    'Southport Boat Angling Club',
    'SOUTHPORT ARGYLE LAWN TENNIS CLUB',
    'Halsall Riding & Livery Centre',
    'Martin Lane Farm Holiday Cottages',
    'Martin Lane Farm - Self Catering Holiday Cottages',
    'Martin Lane Farm Camp Site',
    'Tristrams Farm Holiday Cottages',
    'The Farm Campsite',
    'The Secret Garden Glamping - La Mancha Hall',
    'Barford House - Self-Catering Garden Apartment',
    'Barford House Holiday Apartments - Accommodation Southport',
    'Barford House - 2nd Floor Self-Catering Accommodation Southport',
    'Barford House - Front Self-Catering Apartment Southport',
    'Brooklyn Holiday Park',
    'Willowbank Holiday Home & Touring Park',
    'Freshfield Caravan Park',
    'Shaw Hall Holiday Park',
    'Four Seasons Parks',
    'Moor Lane Leisure Park',
    'Eden Play',
    'Formby Hall Golf Resort & Spa',
    'Sandy Brook Farm',  # if it's a farm shop/cafe
    'Botanic Cottages',
    'Botanic Mews',
    'The Cottage Ash Street',
    'Old Hollow Cottage - Holiday Home',
    'The Coach House - Holiday Home',
    'Cumberland House - Holiday Home',
    'Chase Heys Cottage - Two-Bedroom Holiday Home',
    'Birkdale Holiday Homes',
    'Freshfield Dune Heath Nature Reserve',
    'Ainsdale and Birkdale Sandhills Nature Reserve',
    'H2o Zon Swimming Pool',
    'Shirdley Hill Activity Centre',
    'WACA Recreation Centre',
    'Crossens Community Association',
    'Southport Business Network',
    'Alpine Village',
    'Pleasureland Motorhome Parking',
    'Dobbies Garden Centre Southport',
    'Vincents Garden Centre',
    'Gifts & Things Within Vincents Garden Centre',
    'Arthur\'s Bar & Accommodation',
    'Nightingale Lodge',
    'Littleton Manor Apartment',
    'Promenade Apartments Southport',
    'Promenade Apartments - Apartment with Lake View',
    'The Shelbourne Apartments',
    'Seapark Apartments',
    'Sandcroft Holiday Flats',
    'Grosvenor Apartments Southport',
    'Promenade View',
    'Southport Caravan and Motorhome Club Campsite',
    'Scarisbrick Guide Campsite',
    'Century House Campsite',
    'Jacksmere Camping',
    'Landsdowne Camping',
    'Leisure Lakes Caravan, Camping and Outdoor Pursuits Centre',
    'Hurlston Hall Caravan Park',
    'Alderlee Park',
    'Four Seasons Glamping',
    'Heywood Glamping',
    'Heywood Glamping - Deluxe Apartment',
    'Sephton Farm Fisheries',
    'Wild Root',
    'Pontins Southport Holiday Park',
    'Southport Hotels Association',
    'Rev2race',
    'FUNdamental Football (Birkdale)',
    'D I S C',
    'Another Place',  # Antony Gormley statues - visitor attraction
    'Elixir Skin Clinic Ltd',
    'Halsall West End Cricket Club',
    'Burscough Heritage Group',
    'Star of Hope',
    'Southport Coach House',
    'Big Wheel Southport',
    'Ainsdale Discovery Centre',
    'Ainsdale Pine Woods',
    'Ainsdale Village Park',
    'Banks Marsh NNR',
    'Bedford Park And Garden',
    'Carr Lane Field',
    'Compton Road Park',
    "Children's Playground",
    'Avos Watersports Den',
    'Broadbent Travel Worldchoice',
    'Connections Travel',
    '712 Pilates',
    'Coastline CrossFit',
    'Beat Box Studio',
    'All Turf eBikes',
    'Century Bikes',
    'Bargain Express',
    'Brandons Southport',
    'Chestnut House',
    'Buttercup Cottage',
    'Caravan Holidays North Wales',
    'Chase Heys Cottage',
    'Bifolds, enclosed garden. Southport character home',
    'Bold Arms',
    'Bloom Baby Classes (Banks)',
    'Busy Bee',
    'Busy Bees Southport',
    'Betfred',
    'Age UK',
    'Cancer Research UK',
    'Boots',
    'B&Q Southport',
    'Bensons for Beds Southport',
    'Bonmarche',
    'Bodycare',
    'Bargain Booze',
    'Bargain Booze Select Convenience',
    'CeX',
    'Cash Converters',
    'Camille Lingerie',
    'Coronation Jewels',
    'Coronation News',
    'COVER TO COVER',
    'CLOTHING4KIDS',
    'Clarks',
    'Cambridge Walks',
    'Checkers of Churchtown',
    'Chase Menswear',
    'Corkills Southport',
    'Chocolate Whirled',
    'Booker Southport',
    'Bridal Reloved Southport',
    'A Floral Affair',
    'Angels of Churchtown',
    'Angelz Prom & Party',
    'Animal Barn',
    'Art Boxing Co.',
    'Birkdale Curtains and Interiors (incorporating Rag Doll)',
    'Birkdale Stained Glass',
    'Blazes Fireplace Centres',
    'Blooms by Julie',
    'Belsy Boo',
    'Baby Love',
    "Bailey's Ainsdale",
    'Best one Armann trading county road',
    'Betta & Classic',
}

compiled_keep = [re.compile(p, re.IGNORECASE) for p in KEEP_PATTERNS]
compiled_remove = [re.compile(p, re.IGNORECASE) for p in REMOVE_PATTERNS]
compiled_nonbiz = [re.compile(p, re.IGNORECASE) for p in NON_BUSINESS_PATTERNS]
compiled_airbnb = [re.compile(p, re.IGNORECASE) for p in AIRBNB_PATTERNS]

def classify(name):
    """Classify a business. Returns 'keep', 'remove', or 'unknown'."""
    if not name or name.strip() == '':
        return 'remove', 'empty name'

    # Protected list
    if name in PROTECTED:
        return 'keep', 'protected'

    # Check if it's just a place name
    if name.strip() in PLACE_NAMES:
        return 'remove', 'place name only'

    # Check non-business patterns
    for p in compiled_nonbiz:
        if p.search(name):
            return 'remove', f'non-business: {p.pattern[:40]}'

    # Check Airbnb patterns
    for p in compiled_airbnb:
        if p.search(name):
            return 'remove', f'airbnb rental: {p.pattern[:40]}'

    # Check strong KEEP patterns
    for p in compiled_keep:
        if p.search(name):
            return 'keep', f'matches: {p.pattern[:40]}'

    # Check strong REMOVE patterns
    for p in compiled_remove:
        if p.search(name):
            return 'remove', f'non-visitor: {p.pattern[:40]}'

    # If we can't determine, mark as unknown
    return 'unknown', 'no pattern match'


# Fetch all businesses
with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
    cur.execute('''SELECT id, name, address, "shortDescription", 
                   (SELECT slug FROM "Category" WHERE id = "Business"."categoryId") as cat_slug
                   FROM "Business" ORDER BY name''')
    businesses = cur.fetchall()

keep_list = []
remove_list = []
unknown_list = []

for b in businesses:
    name = b['name'] or ''
    classification, reason = classify(name)

    if classification == 'keep':
        keep_list.append((b, reason))
    elif classification == 'remove':
        remove_list.append((b, reason))
    else:
        unknown_list.append((b, reason))

print(f"Total businesses: {len(businesses)}")
print(f"KEEP: {len(keep_list)}")
print(f"REMOVE: {len(remove_list)}")
print(f"UNKNOWN: {len(unknown_list)}")
print()

# Print unknowns for review - these we'll also remove unless clearly visitor-relevant
print("=" * 70)
print("UNKNOWN (will also be removed unless clearly visitor-relevant):")
print("=" * 70)
for b, reason in unknown_list:
    cat = b['cat_slug'] or '?'
    desc = (b['shortDescription'] or '')[:50]
    safe_name = (b['name'] or '').encode('ascii', 'replace').decode('ascii')
    safe_desc = desc.encode('ascii', 'replace').decode('ascii')
    print(f"  [{cat:15}] {safe_name[:60]:60} | {safe_desc}")

print()
print("=" * 70)
print(f"WILL REMOVE: {len(remove_list)} (pattern-matched) + {len(unknown_list)} (unrecognized)")
print(f"WILL KEEP: {len(keep_list)}")
print("=" * 70)

# Show some of what we're removing
print("\nSample REMOVALS (first 50):")
for b, reason in remove_list[:50]:
    print(f"  {b['name'][:55]:55} | {reason[:40]}")

# Also print category breakdown of keeps
from collections import Counter
keep_cats = Counter(b['cat_slug'] for b, _ in keep_list)
print(f"\nKEEP by category:")
for cat, count in keep_cats.most_common():
    print(f"  {cat or 'none':20} {count}")

# For unknowns, we remove them too - if we can't identify the business
# as visitor-relevant from its name alone, it's probably not what
# visitors are searching for.
print()
total_remove = len(remove_list) + len(unknown_list)
confirm = input(f"Delete {total_remove} businesses? (yes/no): ")
if confirm.lower() != 'yes':
    print("Aborted.")
    conn.close()
    exit(0)

# Delete
all_remove = [b for b, _ in remove_list] + [b for b, _ in unknown_list]
deleted = 0
for b in all_remove:
    with conn.cursor() as cur:
        cur.execute('DELETE FROM "Business" WHERE id = %s', (b['id'],))
    deleted += 1

conn.commit()
conn.close()

print(f"\nDeleted {deleted} businesses.")
print(f"Remaining: {len(businesses) - deleted}")
