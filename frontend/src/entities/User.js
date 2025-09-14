export const User = {
  async list() {
    // Placeholder: fetch users from API later
    return [];
  },
  async me() {
    // Mock logged-in user
    return {
      id: 1,
      full_name: "John Doe",
      emergency_kit_status: "comprehensive",
      contacts: [
        { name: "Jane Doe", phone: "+911234567890" },
        { name: "Mike Smith", phone: "+911112223334" },
      ],
    };
  },
};
