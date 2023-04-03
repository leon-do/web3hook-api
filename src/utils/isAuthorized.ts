import axios from "axios";

export default async function isAuthorized(_license_key: string): Promise<boolean> {
  // https://docs.lemonsqueezy.com/help/licensing/license-api#post-v1-licenses-validate
  const response = await axios.post("https://api.lemonsqueezy.com/v1/licenses/validate", {
    license_key: _license_key,
  });
  if (response.data.license_key.expires_at == null) return true;
  const licenseDate = new Date(response.data.license_key.expires_at);
  const currentDate = new Date();
  return licenseDate >= currentDate;
}
