export const CloudInitGenerator = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [webServer, setWebServer] = useState("nginx");
  const [databaseType, setDatabaseType] = useState("mysql");
  const [nodejs, setNodejs] = useState(false);
  const [yarn, setYarn] = useState(false);
  const [copied, setCopied] = useState(false);

  const webServers = [
    {
      value: "nginx",
      label: "Nginx",
      description: "High-performance web server",
    },
    {
      value: "apache2",
      label: "Apache2",
      description: "Feature-rich HTTP server",
    },
    {
      value: "openlitespeed",
      label: "OpenLiteSpeed",
      description: "High-performance LiteSpeed server",
    },
    {
      value: "mern",
      label: "MERN Stack",
      description: "MongoDB, Express, React, Node.js",
    },
  ];

  const databases = [
    {
      value: "mysql",
      label: "MySQL",
      description: "Popular relational database",
    },
    {
      value: "mariadb",
      label: "MariaDB",
      description: "MySQL-compatible database",
    },
    {
      value: "mongodb",
      label: "MongoDB",
      description: "NoSQL document database",
    },
  ];

  const generateCloudInit = () => {
    const initFlags = [];

    if (username) {
      initFlags.push(`--username ${username}`);
    }
    if (password) {
      initFlags.push(`--password '${password}'`);
    }
    initFlags.push(`--web-server ${webServer}`);
    initFlags.push(`--database-type ${databaseType}`);

    if (nodejs) {
      initFlags.push("--nodejs");
    }
    if (yarn && webServer === "mern") {
      initFlags.push("--yarn");
    }

    const initCommand = `/usr/local/bin/tenbyte-cloud-init init ${initFlags.join(" ")}`;

    return `#cloud-config
package_update: true
package_upgrade: true

packages:
  - wget
  - ca-certificates

runcmd:
  # Housekeeping
  - [ bash, -lc, "export DEBIAN_FRONTEND=noninteractive && apt-get autoremove -y" ]

  # Download and run tenbyte init
  - [ bash, -lc, "wget -O /usr/local/bin/tenbyte-cloud-init https://github.com/vidinfra/tenbyte-init/raw/main/tenbyte-cloud-init-linux-amd64" ]
  - [ bash, -lc, "chmod +x /usr/local/bin/tenbyte-cloud-init" ]
  - [ bash, -lc, "${initCommand}" ]

  # Enable root SSH login
  - [ bash, -lc, "echo 'PermitRootLogin yes' > /etc/ssh/sshd_config.d/allow_root_login.conf" ]
  - [ bash, -lc, "systemctl restart ssh || systemctl restart sshd || service ssh restart || service sshd restart" ]`;
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(generateCloudInit())
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };

  const selectedWebServer = webServers.find((ws) => ws.value === webServer);
  const selectedDatabase = databases.find((db) => db.value === databaseType);

  return (
    <div className="p-4 border dark:border-zinc-950/80 rounded-xl not-prose">
      <div className="space-y-6">
        {/* User Configuration */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-950/70 dark:text-white/70">
            User Configuration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block text-sm text-zinc-950/70 dark:text-white/70">
              Username
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g., webadmin"
                className="w-full mt-1 px-3 py-2 text-sm bg-zinc-950/5 dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 rounded-lg focus:outline-none focus:border-zinc-950/30 dark:focus:border-white/30"
              />
            </label>

            <div>
              <label className="block text-sm text-zinc-950/70 dark:text-white/70">
                Password
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g., SecurePass123!"
                  minLength={8}
                  className="w-full mt-1 px-3 py-2 text-sm bg-zinc-950/5 dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 rounded-lg focus:outline-none focus:border-zinc-950/30 dark:focus:border-white/30"
                />
              </label>
              {password.length > 0 && password.length < 8 && (
                <p className="mt-1 text-xs text-red-500">
                  Password must be at least 8 characters
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Server Configuration */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-950/70 dark:text-white/70">
            Server Configuration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-zinc-950/70 dark:text-white/70">
                Web Server
                <select
                  value={webServer}
                  onChange={(e) => setWebServer(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-sm bg-zinc-950/5 dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 rounded-lg focus:outline-none focus:border-zinc-950/30 dark:focus:border-white/30 cursor-pointer"
                >
                  {webServers.map((ws) => (
                    <option key={ws.value} value={ws.value}>
                      {ws.label}
                    </option>
                  ))}
                </select>
              </label>
              {selectedWebServer && (
                <p className="mt-1 text-xs text-zinc-950/50 dark:text-white/50">
                  {selectedWebServer.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-zinc-950/70 dark:text-white/70">
                Database Type
                <select
                  value={databaseType}
                  onChange={(e) => setDatabaseType(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-sm bg-zinc-950/5 dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 rounded-lg focus:outline-none focus:border-zinc-950/30 dark:focus:border-white/30 cursor-pointer"
                >
                  {databases.map((db) => (
                    <option key={db.value} value={db.value}>
                      {db.label}
                    </option>
                  ))}
                </select>
              </label>
              {selectedDatabase && (
                <p className="mt-1 text-xs text-zinc-950/50 dark:text-white/50">
                  {selectedDatabase.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Options */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-950/70 dark:text-white/70">
            Additional Options
          </h3>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-zinc-950/70 dark:text-white/70 cursor-pointer">
              <input
                type="checkbox"
                checked={nodejs}
                onChange={(e) => setNodejs(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-950/20 dark:border-white/20 cursor-pointer"
              />
              Install Node.js
            </label>

            {webServer === "mern" && (
              <label className="flex items-center gap-2 text-sm text-zinc-950/70 dark:text-white/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={yarn}
                  onChange={(e) => setYarn(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-950/20 dark:border-white/20 cursor-pointer"
                />
                Install Yarn
              </label>
            )}
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-950/70 dark:text-white/70">
              Generated Cloud-Init Config
            </h3>
            <button
              onClick={copyToClipboard}
              className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="p-4 text-xs font-mono bg-zinc-950/5 dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 rounded-lg overflow-x-auto">
            <code className="text-zinc-950/80 dark:text-white/80">
              {generateCloudInit()}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};
