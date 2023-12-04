function generateCustomerID(name, phone) {
    // Ensure name and phone are provided
    if (!name || !phone) {
        throw new Error('Both name and phone are required to generate a customer ID.');
    }

    // Get the first three letters of the name
    const namePrefix = name.substring(0, 3).toUpperCase();

    // Extract the last three digits from the phone number (assuming phone is a string)
    const phoneSuffix = phone.slice(-3);

    // Combine the name prefix and phone suffix to create the customer ID
    const id = `${namePrefix}${phoneSuffix}`;

    return id;
}

module.exports = generateCustomerID;
