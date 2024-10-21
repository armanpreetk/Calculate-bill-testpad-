// script.js

// Sample data for Items and Categories
const items = [
    {
        id: "item1",
        itemName: "Butter Roti",
        rate: 20,
        taxes: [
            {
                name: "Service Charge",
                rate: 10,
                isInPercent: 'Y'
            }
        ],
        category: {
            categoryId: "C2"
        }
    },
    {
        id: "item2",
        itemName: "Paneer Butter Masala",
        rate: 100,
        taxes: [
            {
                name: "Service Charge",
                rate: 10,
                isInPercent: 'Y'
            }
        ],
        category: {
            categoryId: "C1"
        }
    }
];

const categories = [
    {
        id: "C1",
        categoryName: "Platters",
        superCategory: {
            superCategoryName: "South Indian",
            id: "SC1"
        }
    },
    {
        id: "C2",
        categoryName: "Breads",
        superCategory: {
            superCategoryName: "North Indian",
            id: "SC2"
        }
    }
];

const bill = {
    id: "B1",
    billNumber: 1,
    opentime: "06 Nov 2020 14:19",
    customerName: "CodeQuotient",
    billItems: [
        {
            id: "item2",
            quantity: 3,
            discount: {
                rate: 10,
                isInPercent: 'Y'
            }
        }
    ]
};

// Task 1 Function
function createBillStructure(bill, items) {
    const structuredBill = {
        id: bill.id,
        billNumber: bill.billNumber,
        opentime: bill.opentime,
        customerName: bill.customerName,
        billItems: bill.billItems.map(billItem => {
            const item = items.find(i => i.id === billItem.id);
            return {
                id: billItem.id,
                name: item ? item.itemName : '',
                quantity: billItem.quantity
            };
        })
    };
    return structuredBill;
}

// Task 2 Function
function calculateTotalAmount(bill, items, categories) {
    const structuredBill = {
        id: bill.id,
        billNumber: bill.billNumber,
        opentime: bill.opentime,
        customerName: bill.customerName,
        billItems: bill.billItems.map(billItem => {
            const item = items.find(i => i.id === billItem.id);
            const category = categories.find(c => c.id === item.category.categoryId);
            const itemAmount = item.rate * billItem.quantity;
            let discountAmount = 0;

            // Calculate discount
            if (billItem.discount.isInPercent === 'Y') {
                discountAmount = (itemAmount * billItem.discount.rate) / 100;
            } else {
                discountAmount = billItem.discount.rate;
            }

            const amountAfterDiscount = itemAmount - discountAmount;

            // Calculate total taxes
            let totalTax = 0;
            item.taxes.forEach(tax => {
                if (tax.isInPercent === 'Y') {
                    totalTax += (amountAfterDiscount * tax.rate) / 100;
                } else {
                    totalTax += tax.rate;
                }
            });

            const finalAmount = amountAfterDiscount + totalTax;

            return {
                id: billItem.id,
                name: item ? item.itemName : '',
                quantity: billItem.quantity,
                discount: billItem.discount,
                taxes: item.taxes,
                amount: finalAmount,
                superCategoryName: category ? category.superCategory.superCategoryName : '',
                categoryName: category ? category.categoryName : ''
            };
        })
    };

    // Calculate total amount for the bill
    const totalAmount = structuredBill.billItems.reduce((sum, billItem) => sum + billItem.amount, 0);
    structuredBill["Total Amount"] = totalAmount;

    return structuredBill;
}

// Example usage
console.log(JSON.stringify(calculateTotalAmount(bill, items, categories), null, 2));
