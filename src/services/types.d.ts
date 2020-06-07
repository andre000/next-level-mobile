type Item = {
  id: number;
  image: string;
  title: string;
}

type Point = {
  id: number;
  image: string;
  name: string;
  email: string;
  whatsapp: string;
  latitude: string;
  longitude: string;
  city: string;
  uf: string;
  items?: Item[]
}
