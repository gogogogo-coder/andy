interface AppConfig {
  mongodb_uri: string;
  database_name: string;
  collections: {
    users: string;
    professionals: string;
    bookings: string;
    messages: string;
    reviews: string;
    payments: string;
    categories: string;
    translations: string;
    // FIX: Add conversations to the list of collections.
    conversations: string;
  };
}

// Default configuration in case parameters.json is missing or incomplete
const defaultConfig: AppConfig = {
  mongodb_uri: "",
  database_name: "prolink_db",
  collections: {
    users: "users",
    professionals: "professionals",
    bookings: "bookings",
    messages: "messages",
    reviews: "reviews",
    payments: "payments",
    categories: "categories",
    translations: "translations",
    // FIX: Add conversations to the default config.
    conversations: "conversations",
  },
};

// This will hold the final, merged configuration for the app to use.
export let config: AppConfig = { ...defaultConfig };

/**
 * Fetches the external configuration from parameters.json at runtime.
 * It merges the external config with internal defaults and updates the
 * exported `config` object. This function is called once at app startup.
 * @throws {Error} If the parameters.json file is missing, corrupt, or invalid.
 */
export const initializeConfig = async (): Promise<void> => {
  try {
    const response = await fetch('/parameters.json');
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const externalConfig = await response.json();

    // Deep merge the external configuration over the defaults.
    config = {
      ...defaultConfig,
      ...externalConfig,
      collections: {
        ...defaultConfig.collections,
        ...(externalConfig.collections || {}),
      },
    };

    console.log("Application configuration loaded successfully:", config);
  } catch (error) {
    console.error(
      "Could not load external 'parameters.json'. Using default configuration might lead to unexpected behavior.",
      error
    );
    // As per the requirement, throw an error to be handled by the app's entry point.
    throw new Error("Configuration file 'parameters.json' is missing, corrupt, or contains invalid parameters. The application cannot start.");
  }
};