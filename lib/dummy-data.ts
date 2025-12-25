import { faker } from '@faker-js/faker';
import { User, Order, Rider, Merchant, OrderIssue, RiderPayout, Settlement, Payout } from '@/contexts/MockDataContext';
import { subDays, subHours } from 'date-fns';

export function generateUsers(count: number): User[] {
    return Array.from({ length: count }).map((_, i) => ({
        id: `USR-${faker.string.alphanumeric(8).toUpperCase()}`,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        walletBalance: parseFloat(faker.finance.amount({ min: 0, max: 2000, dec: 0 })),
        deviceVersion: `v${faker.system.semver()}`,
        platform: faker.helpers.arrayElement(['android', 'ios']),
        joinedAt: faker.date.past().toISOString(),
        status: faker.helpers.weightedArrayElement([{ weight: 0.8, value: 'active' }, { weight: 0.1, value: 'warned' }, { weight: 0.1, value: 'banned' }]),
        savedAddresses: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map(() => ({
            id: faker.string.uuid(),
            label: faker.helpers.arrayElement(['Home', 'Work', 'Other']),
            address: `${faker.location.streetAddress()}, ${faker.location.city()}`
        }))
    }));
}

export function generateRiders(count: number): Rider[] {
    return Array.from({ length: count }).map((_, i) => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const fullName = `${firstName} ${lastName}`;

        return {
            id: `RIDER-${faker.string.alphanumeric(6).toUpperCase()}`,
            name: fullName,
            phone: faker.phone.number(),
            email: faker.internet.email({ firstName, lastName }),
            vehicleType: faker.helpers.arrayElement(['Bike', 'Scooter', 'Electric Bike']),
            status: faker.helpers.weightedArrayElement([{ weight: 0.7, value: 'active' }, { weight: 0.2, value: 'offline' }, { weight: 0.1, value: 'under_review' }]) as any,
            submittedAt: faker.date.recent().toISOString(),
            deliveryRadius: faker.number.int({ min: 3, max: 20 }),
            kycStatus: faker.helpers.weightedArrayElement([{ weight: 0.8, value: 'verified' }, { weight: 0.1, value: 'pending' }, { weight: 0.1, value: 'rejected' }]),
            location: {
                lat: faker.location.latitude(),
                lng: faker.location.longitude(),
                address: faker.location.streetAddress()
            },
            ekyc: {
                documents: {
                    aadharFront: "https://placehold.co/600x400/png?text=Aadhar+Front",
                    aadharBack: "https://placehold.co/600x400/png?text=Aadhar+Back",
                    selfie: `https://i.pravatar.cc/300?u=${faker.number.int()}`,
                    dl: "https://placehold.co/600x400/png?text=Driving+License",
                    pan: Math.random() > 0.5 ? "https://placehold.co/600x400/png?text=PAN+Card" : undefined
                }
            },
            bankDetails: {
                accountNumber: faker.finance.accountNumber(12),
                ifsc: `HDFC${faker.string.numeric(7)}`,
                beneficiaryName: fullName,
                bankName: "HDFC Bank"
            },
            logistics: { plateNumber: faker.vehicle.vrm(), tShirtSize: 'L' },
            onboardingFee: { status: 'paid', amount: 499 },
            walletBalance: parseFloat(faker.finance.amount({ min: 0, max: 5000, dec: 0 })),
            metrics: {
                onlineTime: faker.number.int({ min: 0, max: 600 }),
                activeTime: faker.number.int({ min: 0, max: 300 }),
                rating: parseFloat(faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 }).toFixed(1)),
                lastOrderTime: faker.date.recent()
            },
            activeOrder: Math.random() > 0.7 ? `ORD-${faker.string.alphanumeric(6).toUpperCase()}` : null
        } as Rider;
    });
}

// ... existing imports

export function generateMerchants(count: number): Merchant[] {
    const storeTypes = ['grocery_food', 'pharmacy_otc', 'fashion_store', 'electronics_appliances', 'meat_fish', 'pet_supplies', 'books_stationery', 'beauty_personal_care'];
    const storeSuffixes = ['Mart', 'Store', 'Boutique', 'Electronics', 'Shop', 'Hub', 'Plaza', 'Point'];

    return Array.from({ length: count }).map((_, i) => {
        const type = faker.helpers.arrayElement(storeTypes);
        const firstName = faker.person.firstName();
        const name = `${firstName}'s ${faker.helpers.arrayElement(storeSuffixes)}`; // e.g. "Sumit's Mart"
        const personName = faker.person.fullName();

        // Generate email based on store name
        const emailSlug = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const email = `contact@${emailSlug}.com`;

        return {
            id: `MER-${faker.string.alphanumeric(6).toUpperCase()}`,
            merchantId: `MER_${faker.string.numeric(8)}`,
            storeId: `STORE_${faker.string.numeric(8)}`,
            ownerUserId: `USR_${faker.string.numeric(8)}`,
            personName: personName,
            storeName: name,
            storeType: type,
            storeLabel: type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            phone: faker.phone.number(),
            email: email,
            personal: {
                name: personName,
                phone: faker.phone.number(),
                email: email
            },
            status: faker.helpers.weightedArrayElement([{ weight: 0.7, value: 'approved' }, { weight: 0.2, value: 'under_review' }, { weight: 0.1, value: 'rejected' }]) as 'approved' | 'rejected' | 'under_review',
            address: {
                line1: faker.location.streetAddress(),
                line2: faker.location.secondaryAddress(),
                city: 'New Delhi',
                state: 'Delhi',
                pincode: faker.location.zipCode(),
                fullAddress: `${faker.location.streetAddress()}, New Delhi`,
                lat: faker.location.latitude({ min: 28.5, max: 28.8 }), // Approx Delhi
                lng: faker.location.longitude({ min: 77.0, max: 77.3 })
            },
            location: faker.location.city(),
            openHours: { timingMode: 'everyday', storeTiming: {} as any },
            walletBalance: parseFloat(faker.finance.amount({ min: 0, max: 50000, dec: 0 })),
            progress: {
                storeProfile: true,
                kycSubmitted: true,
                agreementDone: faker.datatype.boolean(),
                agreementAccepted: faker.datatype.boolean(),
                live: faker.datatype.boolean()
            },
            flags: { storeAdded: true, blocked: faker.datatype.boolean({ probability: 0.05 }) },
            submittedAt: faker.date.past().toISOString(),
            catalogStatus: {
                totalItems: faker.number.int({ min: 10, max: 500 }),
                outOfStock: faker.number.int({ min: 0, max: 50 }),
                essentialOutOfStock: faker.datatype.boolean({ probability: 0.1 })
            }
        } as Merchant;
    });
}


export function generateOrders(count: number, users: User[], merchants: Merchant[]): Order[] {
    if (merchants.length === 0 || users.length === 0) return [];

    return Array.from({ length: count }).map((_, i) => {
        const user = faker.helpers.arrayElement(users);
        const merchant = faker.helpers.arrayElement(merchants);
        return {
            id: `ORD-${Date.now()}-${i}-${faker.string.alphanumeric(4).toUpperCase()}`,
            customerName: user.name,
            customerId: user.id,
            storeName: merchant?.storeName || "Unknown Store",
            amount: parseFloat(faker.finance.amount({ min: 50, max: 2500, dec: 0 })),
            status: faker.helpers.arrayElement(['pending', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'cancelled']),
            createdAt: faker.date.recent({ days: 10 }),
        } as Order;
    });
}

export function generateRiderPayouts(count: number, riders: Rider[]): RiderPayout[] {
    if (riders.length === 0) return [];

    return Array.from({ length: count }).map(() => {
        const rider = faker.helpers.arrayElement(riders);
        return {
            id: `RP-${faker.string.alphanumeric(8).toUpperCase()}`,
            riderId: rider.id,
            riderName: rider.name,
            amount: parseFloat(faker.finance.amount({ min: 500, max: 5000, dec: 0 })),
            status: faker.helpers.weightedArrayElement([{ weight: 0.8, value: 'processed' }, { weight: 0.15, value: 'pending' }, { weight: 0.05, value: 'failed' }]),
            date: faker.date.past(),
            transactionId: `TXN-${faker.string.numeric(10)}`
        } as RiderPayout;
    });
}

export function generatePayouts(count: number, merchants: Merchant[]): Payout[] {
    if (!merchants || merchants.length === 0) return [];

    return Array.from({ length: count }).map(() => {
        const merchant = faker.helpers.arrayElement(merchants);
        return {
            id: `PO-${faker.string.alphanumeric(8).toUpperCase()}`,
            merchantName: merchant.storeName,
            amount: parseFloat(faker.finance.amount({ min: 1000, max: 20000, dec: 0 })),
            status: faker.helpers.weightedArrayElement([{ weight: 0.8, value: 'processed' }, { weight: 0.15, value: 'pending' }, { weight: 0.05, value: 'failed' }]),
            date: faker.date.past(),
            transactionId: `TXN_HDFC_${faker.string.numeric(8)}`
        } as Payout;
    });
}

export function generateSettlements(count: number, merchants: Merchant[], riders: Rider[]): Settlement[] {
    if ((!merchants || merchants.length === 0) && (!riders || riders.length === 0)) return [];

    return Array.from({ length: count }).map(() => {
        const isStore = Math.random() > 0.3; // 70% store settlements
        let recipient: { id: string, name: string };
        let type: 'store' | 'rider';

        if (isStore && merchants && merchants.length > 0) {
            const m = faker.helpers.arrayElement(merchants);
            recipient = { id: m.id, name: m.storeName };
            type = 'store';
        } else if (riders && riders.length > 0) {
            const r = faker.helpers.arrayElement(riders);
            recipient = { id: r.id, name: r.name };
            type = 'rider';
        } else {
            // Fallback if one pool is empty but function called
            return null as unknown as Settlement
        }

        const gross = parseFloat(faker.finance.amount({ min: 2000, max: 25000, dec: 0 }));
        const commission = Math.floor(gross * (type === 'store' ? 0.15 : 0.20));
        const tax = Math.floor(gross * 0.05);
        const net = gross - commission - tax;

        // Ensure dates are strings for JSON compatibility
        const start = faker.date.recent({ days: 60 });
        const end = new Date(start);
        end.setDate(start.getDate() + 7);

        return {
            id: `STLM-${faker.string.alphanumeric(8).toUpperCase()}`,
            recipientId: recipient.id,
            recipientName: recipient.name,
            type: type,
            breakdown: {
                grossAmount: gross,
                commission: commission,
                tax: tax,
                adjustments: 0
            },
            netAmount: net,
            status: faker.helpers.weightedArrayElement([{ weight: 0.8, value: 'processed' }, { weight: 0.15, value: 'pending' }, { weight: 0.05, value: 'failed' }]),
            periodStart: start,
            periodEnd: end,
            transactionReference: `TXNS-${faker.string.numeric(12)}`
        } as Settlement;
    }).filter(Boolean); // Filter out potential nulls
}
