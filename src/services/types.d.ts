type Item = {
  id: number;
  image: string;
  title: string;
};

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
  items?: Item[];
};

type IBGEUFResponse = {
  id: number,
  sigla: string,
  nome: string,
  regiao: {
    id: number,
    sigla: string,
    nome: string
  }
};

type IBGECityResponse = {
  id: number,
  nome: string,
  microrregiao: {
    id: number,
    nome: string,
    mesorregiao: {
      id: number,
      nome: string,
      UF: IBGEUFResponse
    }
  }
};
