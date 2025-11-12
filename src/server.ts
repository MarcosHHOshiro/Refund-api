import { app } from "@/app";
import "dotenv/config";

const PORT = 3333

app.listen(PORT, () => console.log(`Sercer is running on port ${PORT}`))

