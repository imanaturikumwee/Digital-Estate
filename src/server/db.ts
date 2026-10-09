import { Property, User, UserRole, ChatThread, ChatMessage, NotificationItem } from '../types/index.js';

// Scalable In-Memory Data Store (Production-ready interface for PostgreSQL / Cloud SQL)
export class Database {
  private users: Map<string, User & { passwordHash: string }> = new Map();
  private properties: Map<string, Property> = new Map();
  private chats: Map<string, ChatThread> = new Map();
  private messages: Map<string, ChatMessage[]> = new Map();
  private notifications: NotificationItem[] = [];

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Default demo users matching Horizon roles (Buyer, Tenant, Owner, Agent, Staff)
    const demoUsers: (User & { passwordHash: string })[] = [
      {
        id: 'usr-1',
        name: 'Emma Mugisha',
        email: 'owner@digitalestate.rw',
        phone: '+250 788 123 456',
        role: 'owner',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnC_CYf59wj1KWpQbKwTevMc93XUx8tDhFlMINQju0ESrB9wiHgs_Je71Nz198cKnEqi1SHyjucLymsHQleyHUKKjOaVMLWca93yqjqCO_vZwxG0bD4WCj7JtuktMjlttoB0Ub8Yaes96YQ3cjOww2JVjJk-4WXNVNT2QkV4Rw-mKfM2n3_kjJEoM1k9nrSkRnLvUtphuS-60KAtnmdbRetDo_rOh1IHTUZ8YPr85_2vJP71dxPx9kXxHfKdKnwXzIcajJxkoon9RB',
        passwordHash: 'password123',
      },
      {
        id: 'usr-owner-horizon',
        name: 'Emma Mugisha',
        email: 'owner@horizon.rw',
        phone: '+250 788 123 456',
        role: 'owner',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnC_CYf59wj1KWpQbKwTevMc93XUx8tDhFlMINQju0ESrB9wiHgs_Je71Nz198cKnEqi1SHyjucLymsHQleyHUKKjOaVMLWca93yqjqCO_vZwxG0bD4WCj7JtuktMjlttoB0Ub8Yaes96YQ3cjOww2JVjJk-4WXNVNT2QkV4Rw-mKfM2n3_kjJEoM1k9nrSkRnLvUtphuS-60KAtnmdbRetDo_rOh1IHTUZ8YPr85_2vJP71dxPx9kXxHfKdKnwXzIcajJxkoon9RB',
        passwordHash: 'password123',
      },
      {
        id: 'usr-2',
        name: 'Jean-Luc Habimana',
        email: 'buyer@digitalestate.rw',
        phone: '+250 788 987 654',
        role: 'buyer',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNnsM2qZznMr2bOd5Lfw9M6QQq4uZDif7lwv_ggpnimoXxrTK49IyLITqtdfYzMIZrtjY_zUbhwbyCjLCfK6fegHP0E8UeVVTiSERIltCQACEIbuybdiohJHocQ0Tt3VdoWtEg2l5djKg3LPFHNSbeXi6upWW7oaXwvNUqbW29i-2TPcWRdGvrYKjXB2c4g8cj-AJNO0Lyiv_OCg3XcOQkbmlfHnQ82Fs2KxWO8qyTNDjVIdbwloCefmkBkq1nK4UOJTwC334WmHoV',
        passwordHash: 'password123',
      },
      {
        id: 'usr-buyer-horizon',
        name: 'Horizon VIP Investor',
        email: 'investor@horizon.rw',
        phone: '+250 788 555 101',
        role: 'buyer',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNnsM2qZznMr2bOd5Lfw9M6QQq4uZDif7lwv_ggpnimoXxrTK49IyLITqtdfYzMIZrtjY_zUbhwbyCjLCfK6fegHP0E8UeVVTiSERIltCQACEIbuybdiohJHocQ0Tt3VdoWtEg2l5djKg3LPFHNSbeXi6upWW7oaXwvNUqbW29i-2TPcWRdGvrYKjXB2c4g8cj-AJNO0Lyiv_OCg3XcOQkbmlfHnQ82Fs2KxWO8qyTNDjVIdbwloCefmkBkq1nK4UOJTwC334WmHoV',
        passwordHash: 'password123',
      },
      {
        id: 'usr-tenant-horizon',
        name: 'Diplomatic Resident',
        email: 'tenant@horizon.rw',
        phone: '+250 788 555 102',
        role: 'tenant',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGsxJf63wBNFLzunIniZ6gsts8iZTtMZMBoTk6qcnYAsJn3XfyZ39rQLLVMn7WvAju7ewdihcb_H1Wkh7WVLUMKL0vww1Mor9MDAArbRrP4W7a5Q13kl3aUWZIxQFVAmBbKTCBJEam6dRGoywvcU9BXvmA1IFEMV3wVhI1iR88iDQjMU3bWtxAEMkLoWxUmGSr7xXk_cQ5fbsyvVPvGj9HTPQDCXFXPngftFQfhxljNt_O7YxC4iFx-4BLXxMTtFsi4YQ3Cf0e1ohQ',
        passwordHash: 'password123',
      },
      {
        id: 'usr-agent-horizon',
        name: 'Dany Mugisha',
        email: 'agent@horizon.rw',
        phone: '+250 788 555 103',
        role: 'agent',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGsxJf63wBNFLzunIniZ6gsts8iZTtMZMBoTk6qcnYAsJn3XfyZ39rQLLVMn7WvAju7ewdihcb_H1Wkh7WVLUMKL0vww1Mor9MDAArbRrP4W7a5Q13kl3aUWZIxQFVAmBbKTCBJEam6dRGoywvcU9BXvmA1IFEMV3wVhI1iR88iDQjMU3bWtxAEMkLoWxUmGSr7xXk_cQ5fbsyvVPvGj9HTPQDCXFXPngftFQfhxljNt_O7YxC4iFx-4BLXxMTtFsi4YQ3Cf0e1ohQ',
        passwordHash: 'password123',
      },
      {
        id: 'usr-staff-horizon',
        name: 'Horizon Concierge Staff',
        email: 'staff@horizon.rw',
        phone: '+250 788 555 104',
        role: 'staff',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnC_CYf59wj1KWpQbKwTevMc93XUx8tDhFlMINQju0ESrB9wiHgs_Je71Nz198cKnEqi1SHyjucLymsHQleyHUKKjOaVMLWca93yqjqCO_vZwxG0bD4WCj7JtuktMjlttoB0Ub8Yaes96YQ3cjOww2JVjJk-4WXNVNT2QkV4Rw-mKfM2n3_kjJEoM1k9nrSkRnLvUtphuS-60KAtnmdbRetDo_rOh1IHTUZ8YPr85_2vJP71dxPx9kXxHfKdKnwXzIcajJxkoon9RB',
        passwordHash: 'password123',
      },
    ];

    demoUsers.forEach(u => this.users.set(u.email.toLowerCase(), u));

    // Seed Properties matching the user screenshots exactly
    const initialProperties: Property[] = [
      {
        id: 'prop-1',
        title: 'Kigali View Heights',
        price: 450000,
        formattedPrice: '$450,000',
        location: 'Rebero District, Kigali',
        district: 'Rebero',
        propertyType: 'Residential',
        beds: 4,
        baths: 4,
        areaSqMeters: 420,
        status: 'Active',
        views: 192,
        leads: 14,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqWz3SlViR7Ll3TPo1pk7UyIlc5ixxcyhdje3zzQGZvLkgSW8TcZR7Z1EeMY2YGkDiXu0i1J5YoOMvebjNpKrM4_Gk3S1LuK2z6eT9OFcLVAUm3HfWPoDZfyKPkOrGcZkyYgREduu7sVbGHVOVGhc-fb63-H921dxhyhp6PrR8vrBJ0FDC1Aw6RBpu96Ld-C5zeAELKSDMep_c1jDsuEVtdZ4CoUD43GN5MKAfC-WjxV7VxC1CUgjhUmn7PAyPDFNeQY-TwtydZawP',
        aiScore: 94,
        growthPotential: '+12.4% /yr',
        riskLevel: 'Very Low',
        featured: true,
        description: 'Ultra-modern luxury villa with infinity pool, floor-to-ceiling glass panoramic windows and smart climate engineering overlooking the Rebero hills.',
      },
      {
        id: 'prop-2',
        title: 'Bugesera Industrial Plot',
        price: 120000,
        formattedPrice: '$120,000',
        location: 'Bugesera Special Economic Zone',
        district: 'Bugesera',
        propertyType: 'Land',
        areaHectares: 1.2,
        status: 'Pending Approval',
        views: 84,
        leads: 3,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxzX8KJ39U9HLMpeIoVllGed8qJ1WR-uqDyJxjsSVCEQ2TaEqOuzVbM92tynbPesQlFg8jpxkT0c2kfHFfHccOvvVzQ-X3dxZOZoalo6_1TxRiyvQDJCJcvcZEfM0Ghns-1qdMHjBkKlU9Of8lDCcQ_L-ibZjsw4b9LEkaIO_QmzXxlzY-ps5rlVMFIuJZ6stolQNU6fibjYs8eG7tVHlhC5bt4MM-AW0_Gu83p9vSOEkAKbG-1KtW81fISQanEbSMSoHIX4nMg6Vg',
        aiScore: 88,
        growthPotential: '+18.5% /yr',
        riskLevel: 'Low',
        featured: false,
        description: 'Prime grade-A industrial development parcel near the upcoming Bugesera International Airport with dedicated road infrastructure.',
      },
      {
        id: 'prop-3',
        title: 'The Horizon Plaza',
        price: 2400000,
        formattedPrice: '$2.4M',
        location: 'City Center, Kigali',
        district: 'Nyarugenge',
        propertyType: 'Commercial',
        areaSqMeters: 2800,
        status: 'Active',
        views: 410,
        leads: 28,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7naNZ_oasi-90oPB6UL1QXQniwd0xxcTsefTzEz3AJXdb1Clzi6I_5O0pFX6APuUh9cld57-qBGzChnHG4war9Okas08IVa1Vxr2vlQjhIVGP6bIRuz08z966eXeS5kyioqCNAo3b07MaDdp6bSRZVY7bCw9Uku_KSLoGmMmB4kTspjOColMzW8kW65FbdFTHieOiPqlpMwRbjzTBV0HEaxZxdmjHxBMcQ7euF-4cz3P9WhHerMO0a5pMnxaEQ1DX30Xnm5z8RyXe',
        aiScore: 91,
        growthPotential: '+9.8% /yr',
        riskLevel: 'Very Low',
        featured: true,
        description: 'Contemporary commercial tower in Kigali central business district featuring Class-A office suites and anchor bank tenancy.',
      },
      {
        id: 'prop-4',
        title: 'Lake Trail Estate',
        price: 1100000,
        formattedPrice: '$1.1M',
        location: 'Kibuye, Lake Kivu',
        district: 'Karongi',
        propertyType: 'Investment',
        beds: 5,
        baths: 5,
        areaSqMeters: 650,
        status: 'Active',
        views: 275,
        leads: 19,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeeZuGAHNWmlWYCWaRRf5wZxKB4lQaLOI-i65zMy3LuJIYYSmtu0VDaXJe5ZpTQFVGdYjWHKIAAkk5y6UKTNbUgvihKbypaz42uzz6UN86cG1ZsvDgrMiqV1sQ_Ntuqo116cG23GJyCHRcJwnyTQHwQjvZHns1J73vSNZuGi_Un9NYfuEdGg4_9YfXo4ATjznCQUUtAjy7Ot2UhrZHY8XhgfM68ePDMHkOM0ch86lrW2imQsXBNoAb4roUg8HcLBptn_-KBcJKfTwZ',
        aiScore: 96,
        growthPotential: '+14.2% /yr',
        riskLevel: 'Low',
        featured: true,
        description: 'Boutique waterfront hospitality compound with private pontoon, lush indigenous gardens, and eco-sustainable solar systems.',
      },
      {
        id: 'prop-5',
        title: 'The Obsidian Pavilion',
        price: 850000,
        formattedPrice: '$850,000',
        location: 'Nyarutarama Estate, Kigali',
        district: 'Nyarutarama',
        propertyType: 'Residential',
        beds: 5,
        baths: 4,
        areaSqMeters: 550,
        status: 'Active',
        views: 312,
        leads: 22,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsBPAT2iRLAu6TsJ8C9sklC6Nh7liAEVTnpqBYbUAN2_bLel1Jc8Ulk2rv0Q5_ryr4g1qFGVut8i6pl1dmG_1II34_Q-1eRdXwFL0ZMWKsHnrtKQ2jByLDXuSIp7d4Ds3XBaAQiZgFU_LsMwa6rqwbvDhxPbsQyb7XsIRg4l3CNRHLUT9bfW00bg8rw6Kyyd5-gmEJQJk8p0OBJdNiFSbeWvUY0LoIkgYeX0koQ2yzpSwprVWDwc_P0oWosEx-O4eM-ckiKRcsy4rN',
        aiScore: 97,
        growthPotential: '+13.5% /yr',
        riskLevel: 'Very Low',
        featured: true,
        description: 'A masterclass in tropical modernism featuring integrated solar power, rain harvesting, and serene infinity pool overlooking Nyarutarama golf course.',
      },
      {
        id: 'prop-6',
        title: 'Terrace Heights Phase II',
        price: 320000,
        formattedPrice: '$320,000',
        location: 'Rebero Ridge, Kigali',
        district: 'Rebero',
        propertyType: 'Investment',
        beds: 3,
        baths: 2,
        areaSqMeters: 220,
        status: 'Active',
        views: 180,
        leads: 11,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOt6tlk3-Kt2y7_2EEdsC6MBgsZ36fl2KK_nOuaxCoswVSnL5OP-QH0PuJZGMyYTGg4reJxefEBAJ0uSSyg6tqUa63AU6caz9Ax-Z1_b8VlivM9QOUS6XL76YKQFQDxKN1qvImzzXjVMA74eH6TFHwT0jWFHxCQ7z6lRVUuBULMuwAVVlX3V2VG5vHpU5Q9t9zI4vFxyAWdVPaEacAmogzZkzYl7vkbtXSD_cstkm3y6ZulAexKUzry5fXbQjwAty_vFH1RAW1MU8x',
        aiScore: 93,
        growthPotential: '+8.0% Guaranteed',
        riskLevel: 'Very Low',
        featured: false,
        description: 'Sustainable apartment living with panoramic views of Kigali city skyline, underground parking, and community fitness center.',
      },
      {
        id: 'prop-7',
        title: 'Slope House II',
        price: 840000,
        formattedPrice: '$840,000',
        location: 'Kigali Heights, District 4',
        district: 'Gasabo',
        propertyType: 'Residential',
        beds: 4,
        baths: 3,
        areaSqMeters: 380,
        status: 'Active',
        views: 164,
        leads: 9,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbLk0AYJjnlR-SSNMhaHaN9TbdEgGBK89HpcX1f4H9bu1UgO-Lv4KYzoelEfQVAM0HxpcXW4X4mGZnvFohAUoBOhEJXqK0ryvTKc3OTCnYLB1McFD-ocTTDTWgLaPSswE_oG6FbwOUNd8KoQBWvfs8yQLTXPbZEe0087PUy4gRZsgbVTS48QvMzgjxyrDdtjL4r5IRXiep5GKnsACtvRvZRippURtJfDLhAsvscooTRdBLMRNU7RaW0VGe_2AynFuyI-hzF3cAXzBP',
        aiScore: 92,
        growthPotential: '+11.2% /yr',
        riskLevel: 'Low',
        featured: true,
        description: 'Architectural stone cantilever villa cascading down the natural topography with private terraced gardens and sunset lounge.',
      },
      {
        id: 'prop-8',
        title: 'The Gishushu Manor',
        price: 1200000,
        formattedPrice: '$1,200,000',
        location: 'Gishushu, Kigali',
        district: 'Gishushu',
        propertyType: 'Residential',
        beds: 6,
        baths: 7,
        areaSqMeters: 620,
        status: 'Active',
        views: 290,
        leads: 18,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAP8FumKAHmSQmZcqdW8vc6meGKqBVqlB1_EFWzgnp1Ia5fmUHjIO9AQQiyCrDhAt9zQM1sC1iW8u1VKh897Fwu6CbD0CTa3-OWQgnzLGWGGCtN5UE_213PhUaS_2dLIT1mmQ87u7Ys-nHlsp5b_-PfxFGVVTiij1osHUUFc31rf7K63TdCICYbitZBon2uSxwRz167_kQP3Tm4oFqR5LyxRNoM-ZEtn9dTx5ngIlmrG36EpHOGagwQr5coiel483GQFMnMFgnVvfB',
        aiScore: 95,
        growthPotential: '+10.5% /yr',
        riskLevel: 'Very Low',
        featured: true,
        description: 'Grand architectural residence with warm wood accents, wrap-around terraces, staff quarters, and high-security biometric access.',
      }
    ];

    initialProperties.forEach(p => this.properties.set(p.id, p));

    // Seed Chats
    const chat1: ChatThread = {
      id: 'chat-dany',
      participantName: 'Agent Dany',
      participantRole: 'Expert Consultant • Kigali District',
      participantAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGsxJf63wBNFLzunIniZ6gsts8iZTtMZMBoTk6qcnYAsJn3XfyZ39rQLLVMn7WvAju7ewdihcb_H1Wkh7WVLUMKL0vww1Mor9MDAArbRrP4W7a5Q13kl3aUWZIxQFVAmBbKTCBJEam6dRGoywvcU9BXvmA1IFEMV3wVhI1iR88iDQjMU3bWtxAEMkLoWxUmGSr7xXk_cQ5fbsyvVPvGj9HTPQDCXFXPngftFQfhxljNt_O7YxC4iFx-4BLXxMTtFsi4YQ3Cf0e1ohQ',
      online: true,
      propertyContext: {
        id: 'prop-1',
        title: 'Kigali View Heights',
        price: '$450,000',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqWz3SlViR7Ll3TPo1pk7UyIlc5ixxcyhdje3zzQGZvLkgSW8TcZR7Z1EeMY2YGkDiXu0i1J5YoOMvebjNpKrM4_Gk3S1LuK2z6eT9OFcLVAUm3HfWPoDZfyKPkOrGcZkyYgREduu7sVbGHVOVGhc-fb63-H921dxhyhp6PrR8vrBJ0FDC1Aw6RBpu96Ld-C5zeAELKSDMep_c1jDsuEVtdZ4CoUD43GN5MKAfC-WjxV7VxC1CUgjhUmn7PAyPDFNeQY-TwtydZawP',
      },
      lastMessage: 'Your AI Score for this plot is 94/100...',
      lastMessageTime: '2m ago',
      unreadCount: 1,
    };

    const chat2: ChatThread = {
      id: 'chat-emma',
      participantName: 'Emma M.',
      participantRole: 'Senior Property Director',
      participantAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUA_RscGCKX5F4hHXcrmkUt3c8V4VaYM-q-xTTLjElBzvxZQh-OppXDgl1AvAIsdoPSbqqL3yMYfGjsPb5vHZbfTXOXPgJcz07pfGKNRTYI2TYcbLBd4qQ2QFwv2lmwPREoeAuCFTaIlhl73dXvk3XBXEnC3oDDLGMuyM2io0YjZo26j6KB-m6dJEykOM5cIANypqo-Lsx_l61mawn6M72UbVUPsAsqjwNOXv_6ImpTyJtDfrUKpGkUR-1Mr5bi8t1PHPn5CqeVgQa',
      online: false,
      tag: 'Scheduled Viewing',
      lastMessage: 'Meeting confirmed for tomorrow at 10 AM.',
      lastMessageTime: '1h ago',
      unreadCount: 0,
    };

    this.chats.set(chat1.id, chat1);
    this.chats.set(chat2.id, chat2);

    // Initial message thread matching Image 13 & 15
    this.messages.set('chat-dany', [
      {
        id: 'msg-1',
        chatId: 'chat-dany',
        sender: 'user',
        senderName: 'You',
        senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnC_CYf59wj1KWpQbKwTevMc93XUx8tDhFlMINQju0ESrB9wiHgs_Je71Nz198cKnEqi1SHyjucLymsHQleyHUKKjOaVMLWca93yqjqCO_vZwxG0bD4WCj7JtuktMjlttoB0Ub8Yaes96YQ3cjOww2JVjJk-4WXNVNT2QkV4Rw-mKfM2n3_kjJEoM1k9nrSkRnLvUtphuS-60KAtnmdbRetDo_rOh1IHTUZ8YPr85_2vJP71dxPx9kXxHfKdKnwXzIcajJxkoon9RB',
        text: "Hello Dany! I've been looking at the property in Nyarutarama. Can you give me more insights on the investment potential there?",
        timestamp: '14:22',
      },
      {
        id: 'msg-2',
        chatId: 'chat-dany',
        sender: 'agent',
        senderName: 'Agent Dany',
        senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGsxJf63wBNFLzunIniZ6gsts8iZTtMZMBoTk6qcnYAsJn3XfyZ39rQLLVMn7WvAju7ewdihcb_H1Wkh7WVLUMKL0vww1Mor9MDAArbRrP4W7a5Q13kl3aUWZIxQFVAmBbKTCBJEam6dRGoywvcU9BXvmA1IFEMV3wVhI1iR88iDQjMU3bWtxAEMkLoWxUmGSr7xXk_cQ5fbsyvVPvGj9HTPQDCXFXPngftFQfhxljNt_O7YxC4iFx-4BLXxMTtFsi4YQ3Cf0e1ohQ',
        text: 'Absolutely. This plot specifically is in a prime development zone. Here is our proprietary AI Market Insight for this location:',
        timestamp: '14:25',
        aiScoreCard: {
          score: 94,
          growthPotential: '+12.4% /yr',
          riskLevel: 'Very Low',
          rationale: 'Kigali View Heights benefits from its proximity to the new diplomatic hub, ensuring sustained valuation premium.',
        },
      },
      {
        id: 'msg-3',
        chatId: 'chat-dany',
        sender: 'user',
        senderName: 'You',
        senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnC_CYf59wj1KWpQbKwTevMc93XUx8tDhFlMINQju0ESrB9wiHgs_Je71Nz198cKnEqi1SHyjucLymsHQleyHUKKjOaVMLWca93yqjqCO_vZwxG0bD4WCj7JtuktMjlttoB0Ub8Yaes96YQ3cjOww2JVjJk-4WXNVNT2QkV4Rw-mKfM2n3_kjJEoM1k9nrSkRnLvUtphuS-60KAtnmdbRetDo_rOh1IHTUZ8YPr85_2vJP71dxPx9kXxHfKdKnwXzIcajJxkoon9RB',
        text: 'That score is impressive. When can we visit the site?',
        timestamp: '14:28',
      },
    ]);

    // Initial Notifications
    this.notifications = [
      {
        id: 'notif-1',
        title: 'New Inbound Lead',
        message: 'A qualified diaspora investor requested valuation for Kigali View Heights.',
        time: '5m ago',
        read: false,
        type: 'lead',
      },
      {
        id: 'notif-2',
        title: 'Quarterly Valuation Updated',
        message: 'Portfolio value re-indexed +4.2% across Rebero and Nyarutarama holdings.',
        time: '1h ago',
        read: false,
        type: 'valuation',
      },
      {
        id: 'notif-3',
        title: 'Viewing Scheduled',
        message: 'Agent Dany confirmed on-site tour with buyer Emma M. for tomorrow 10:00 AM.',
        time: '3h ago',
        read: true,
        type: 'message',
      },
    ];
  }

  // User Operations
  findUserByEmail(email: string) {
    return this.users.get(email.toLowerCase());
  }

  findUserById(id: string) {
    for (const user of this.users.values()) {
      if (user.id === id) return user;
    }
    return undefined;
  }

  createUser(userData: Omit<User, 'id' | 'avatarUrl'> & { avatarUrl?: string; password: string }) {
    const id = `usr-${Date.now()}`;
    const newUser: User & { passwordHash: string } = {
      id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      avatarUrl: userData.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnC_CYf59wj1KWpQbKwTevMc93XUx8tDhFlMINQju0ESrB9wiHgs_Je71Nz198cKnEqi1SHyjucLymsHQleyHUKKjOaVMLWca93yqjqCO_vZwxG0bD4WCj7JtuktMjlttoB0Ub8Yaes96YQ3cjOww2JVjJk-4WXNVNT2QkV4Rw-mKfM2n3_kjJEoM1k9nrSkRnLvUtphuS-60KAtnmdbRetDo_rOh1IHTUZ8YPr85_2vJP71dxPx9kXxHfKdKnwXzIcajJxkoon9RB',
      passwordHash: userData.password,
    };
    this.users.set(newUser.email.toLowerCase(), newUser);
    return newUser;
  }

  findOrCreateOAuthUser(provider: string, role: UserRole = 'buyer', email?: string, name?: string) {
    const cleanEmail = email ? email.toLowerCase() : `${provider}.${role}@horizon.rw`;
    let user = this.findUserByEmail(cleanEmail);
    if (!user) {
      const providerLabel = provider.charAt(0).toUpperCase() + provider.slice(1);
      const displayName = name || `${providerLabel} Verified ${role.charAt(0).toUpperCase() + role.slice(1)}`;
      const avatarMap: Record<UserRole, string> = {
        buyer: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNnsM2qZznMr2bOd5Lfw9M6QQq4uZDif7lwv_ggpnimoXxrTK49IyLITqtdfYzMIZrtjY_zUbhwbyCjLCfK6fegHP0E8UeVVTiSERIltCQACEIbuybdiohJHocQ0Tt3VdoWtEg2l5djKg3LPFHNSbeXi6upWW7oaXwvNUqbW29i-2TPcWRdGvrYKjXB2c4g8cj-AJNO0Lyiv_OCg3XcOQkbmlfHnQ82Fs2KxWO8qyTNDjVIdbwloCefmkBkq1nK4UOJTwC334WmHoV',
        tenant: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGsxJf63wBNFLzunIniZ6gsts8iZTtMZMBoTk6qcnYAsJn3XfyZ39rQLLVMn7WvAju7ewdihcb_H1Wkh7WVLUMKL0vww1Mor9MDAArbRrP4W7a5Q13kl3aUWZIxQFVAmBbKTCBJEam6dRGoywvcU9BXvmA1IFEMV3wVhI1iR88iDQjMU3bWtxAEMkLoWxUmGSr7xXk_cQ5fbsyvVPvGj9HTPQDCXFXPngftFQfhxljNt_O7YxC4iFx-4BLXxMTtFsi4YQ3Cf0e1ohQ',
        owner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnC_CYf59wj1KWpQbKwTevMc93XUx8tDhFlMINQju0ESrB9wiHgs_Je71Nz198cKnEqi1SHyjucLymsHQleyHUKKjOaVMLWca93yqjqCO_vZwxG0bD4WCj7JtuktMjlttoB0Ub8Yaes96YQ3cjOww2JVjJk-4WXNVNT2QkV4Rw-mKfM2n3_kjJEoM1k9nrSkRnLvUtphuS-60KAtnmdbRetDo_rOh1IHTUZ8YPr85_2vJP71dxPx9kXxHfKdKnwXzIcajJxkoon9RB',
        agent: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGsxJf63wBNFLzunIniZ6gsts8iZTtMZMBoTk6qcnYAsJn3XfyZ39rQLLVMn7WvAju7ewdihcb_H1Wkh7WVLUMKL0vww1Mor9MDAArbRrP4W7a5Q13kl3aUWZIxQFVAmBbKTCBJEam6dRGoywvcU9BXvmA1IFEMV3wVhI1iR88iDQjMU3bWtxAEMkLoWxUmGSr7xXk_cQ5fbsyvVPvGj9HTPQDCXFXPngftFQfhxljNt_O7YxC4iFx-4BLXxMTtFsi4YQ3Cf0e1ohQ',
        staff: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnC_CYf59wj1KWpQbKwTevMc93XUx8tDhFlMINQju0ESrB9wiHgs_Je71Nz198cKnEqi1SHyjucLymsHQleyHUKKjOaVMLWca93yqjqCO_vZwxG0bD4WCj7JtuktMjlttoB0Ub8Yaes96YQ3cjOww2JVjJk-4WXNVNT2QkV4Rw-mKfM2n3_kjJEoM1k9nrSkRnLvUtphuS-60KAtnmdbRetDo_rOh1IHTUZ8YPr85_2vJP71dxPx9kXxHfKdKnwXzIcajJxkoon9RB',
      };

      user = this.createUser({
        name: displayName,
        email: cleanEmail,
        role,
        password: `oauth_${provider}_secret`,
        avatarUrl: avatarMap[role] || avatarMap.buyer,
      });
    } else if (role && user.role !== role) {
      user.role = role;
    }
    return user;
  }

  // Property Operations
  getAllProperties(): Property[] {
    return Array.from(this.properties.values());
  }

  getPropertyById(id: string): Property | undefined {
    return this.properties.get(id);
  }

  addProperty(property: Omit<Property, 'id' | 'views' | 'leads'>): Property {
    const id = `prop-${Date.now()}`;
    const newProp: Property = {
      ...property,
      id,
      views: 1,
      leads: 0,
      formattedPrice: `$${property.price.toLocaleString()}`,
    };
    this.properties.set(id, newProp);
    return newProp;
  }

  // Chats & Messages
  getChats(): ChatThread[] {
    return Array.from(this.chats.values());
  }

  getMessages(chatId: string): ChatMessage[] {
    return this.messages.get(chatId) || [];
  }

  addMessage(chatId: string, text: string, sender: 'user' | 'agent' = 'user'): ChatMessage {
    const currentMessages = this.messages.get(chatId) || [];
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      chatId,
      sender,
      senderName: sender === 'user' ? 'You' : 'Agent Dany',
      senderAvatar: sender === 'user'
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnC_CYf59wj1KWpQbKwTevMc93XUx8tDhFlMINQju0ESrB9wiHgs_Je71Nz198cKnEqi1SHyjucLymsHQleyHUKKjOaVMLWca93yqjqCO_vZwxG0bD4WCj7JtuktMjlttoB0Ub8Yaes96YQ3cjOww2JVjJk-4WXNVNT2QkV4Rw-mKfM2n3_kjJEoM1k9nrSkRnLvUtphuS-60KAtnmdbRetDo_rOh1IHTUZ8YPr85_2vJP71dxPx9kXxHfKdKnwXzIcajJxkoon9RB'
        : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGsxJf63wBNFLzunIniZ6gsts8iZTtMZMBoTk6qcnYAsJn3XfyZ39rQLLVMn7WvAju7ewdihcb_H1Wkh7WVLUMKL0vww1Mor9MDAArbRrP4W7a5Q13kl3aUWZIxQFVAmBbKTCBJEam6dRGoywvcU9BXvmA1IFEMV3wVhI1iR88iDQjMU3bWtxAEMkLoWxUmGSr7xXk_cQ5fbsyvVPvGj9HTPQDCXFXPngftFQfhxljNt_O7YxC4iFx-4BLXxMTtFsi4YQ3Cf0e1ohQ',
      text,
      timestamp: timeStr,
    };

    currentMessages.push(newMsg);
    this.messages.set(chatId, currentMessages);

    // Update last message in thread
    const thread = this.chats.get(chatId);
    if (thread) {
      thread.lastMessage = text;
      thread.lastMessageTime = 'Just now';
      this.chats.set(chatId, thread);
    }

    return newMsg;
  }

  // Notifications
  getNotifications(): NotificationItem[] {
    return this.notifications;
  }

  addNotification(item: Omit<NotificationItem, 'id' | 'read' | 'time'>): NotificationItem {
    const notif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      read: false,
      time: 'Just now',
    };
    this.notifications.unshift(notif);
    return notif;
  }

  markNotificationAsRead(id: string): boolean {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      return true;
    }
    return false;
  }
}

export const db = new Database();
