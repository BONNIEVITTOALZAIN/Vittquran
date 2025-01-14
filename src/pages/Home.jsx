import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Main from '../layout/Main';
import BreadCrumbs from '../components/BreadCrumbs';
import SearchBar from '../components/SearchBar';


const Home = () => {
  const [surah, setSurah] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  const getSurah = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://api.quran.gading.dev/surah');
      setSurah(res.data.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSurah();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      setCurrentTime(formattedTime);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Main>
      <div className="container mx-auto bg-white min-h-screen">
        <nav className="py-6 px-7">
          <div className="flex justify-between items-center text-gray-500">
            <BreadCrumbs loading={loading} />
            <span id="clock" className="text-sm" > {currentTime}</span>
          </div>
        </nav>
        <div className="px-7 pt-6">
          <div>
            <p className="text-gray-500">Al-Quran</p>
            <p className="text-3xl font-semibold mt-2">Baca Surah</p>
          </div>
          <div className="mt-4">
            <SearchBar
              placeholder="Cari Surah"
              onChangeSearch={(e) => setSearch(e.target.value.toLowerCase())}
            />
          </div>
          {loading ? (
            <div className="mt-8 flex justify-center">
              <div className="lds-ripple"><div /><div /></div>
            </div>
          ) : (
            <div className="mt-8">
              {surah.filter((_surah) => (
                search === '' ||
                _surah.name.transliteration.id.toLowerCase().includes(search)
              )).map((_surah) => (
                <Link to={`/surah/${_surah.number}`} key={_surah?.number}>
                  <div className="flex items-center justify-between py-4 border-b" data-aos="fade-up">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex justify-center items-center border border-emerald-500">
                        <span className="text-slate-500 text-sm">{_surah.number}</span>
                      </div>
                      <div>
                        <p className="font-semibold">{_surah.name.transliteration.id}</p>
                        <p className="text-sm text-slate-500">{_surah.name.translation.id}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-2xl nama-surah">{_surah.name.short}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Main>
  );
};

export default React.memo(Home);
