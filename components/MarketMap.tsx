import React, { useEffect, useRef, useState } from 'react';
import { 
  X, Map as MapIcon, Layers, Navigation2, Search, 
  Maximize2, MousePointer2, Ruler, Copy, ExternalLink, 
  Satellite, Mountain, Moon, Info
} from 'lucide-react';
import { Product } from '../types';

// Access globals loaded via script tags
declare global {
    interface Window {
        maplibregl: any;
        turf: any;
    }
}

const maplibregl = (window as any).maplibregl;
const turf = (window as any).turf;

const MAPTILER_KEY = 'Ja4TBd4m6fQ3CP0iYJLZ';
const SUDAN_CENTER: [number, number] = [32.98, 14.23]; // Al Manaqil Center

const MAP_STYLES = [
    { id: 'streets', name: 'Streets v2', icon: <MapIcon size={18}/>, url: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}` },
    { id: 'satellite', name: 'Satellite', icon: <Satellite size={18}/>, url: `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_KEY}` },
    { id: 'topo', name: 'Topography', icon: <Mountain size={18}/>, url: `https://api.maptiler.com/maps/topo-v2/style.json?key=${MAPTILER_KEY}` },
    { id: 'dark', name: 'DataViz Dark', icon: <Moon size={18}/>, url: `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${MAPTILER_KEY}` }
];

interface MarketMapProps {
    products: Product[];
    onClose: () => void;
    onProductClick: (p: Product) => void;
}

const MarketMap: React.FC<MarketMapProps> = ({ products, onClose, onProductClick }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<any>(null);
    const [activeStyle, setActiveStyle] = useState(MAP_STYLES[0]);
    const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
    const [distance, setDistance] = useState<number | null>(null);
    const [isMeasuring, setIsMeasuring] = useState(false);
    const measurePoints = useRef<[number, number][]>([]);

    useEffect(() => {
        if (!mapContainer.current || !maplibregl) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: activeStyle.url,
            center: SUDAN_CENTER,
            zoom: 13,
            attributionControl: false
        });

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
        map.current.addControl(new maplibregl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true
        }), 'top-right');

        map.current.on('click', (e: any) => {
            const { lng, lat } = e.lngLat;
            setCoords({ lat, lng });

            if (isMeasuring) {
                measurePoints.current.push([lng, lat]);
                updateMeasureLine();
            }
        });

        // Add Markers for Products
        products.forEach((p: Product) => {
            if (p.lat && p.lng) {
                const el = document.createElement('div');
                el.className = 'w-10 h-10 bg-white rounded-full border-4 border-[#0F7143] shadow-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform overflow-hidden';
                el.innerHTML = `<img src="${p.imageUrl}" class="w-full h-full object-cover" />`;
                
                el.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const popupNode = document.createElement('div');
                    popupNode.className = 'p-3 min-w-[200px] text-right';
                    popupNode.innerHTML = `
                        <h4 class="font-black text-slate-800 mb-1">${p.title}</h4>
                        <p class="text-[10px] text-slate-500 mb-2 font-bold">${p.location}</p>
                        <p class="text-sm font-black text-[#0F7143] mb-3">${p.price.toLocaleString()} ${p.currency}</p>
                        <button id="view-btn-${p.id}" class="w-full bg-slate-900 text-white text-[10px] font-black py-2 rounded-lg">عرض التفاصيل</button>
                    `;

                    new maplibregl.Popup({ offset: 25, closeButton: false })
                        .setLngLat([p.lng!, p.lat!])
                        .setDOMContent(popupNode)
                        .addTo(map.current!);

                    setTimeout(() => {
                        document.getElementById(`view-btn-${p.id}`)?.addEventListener('click', () => onProductClick(p));
                    }, 0);
                });

                new maplibregl.Marker({ element: el })
                    .setLngLat([p.lng, p.lat])
                    .addTo(map.current!);
            }
        });

        return () => map.current?.remove();
    }, []);

    useEffect(() => {
        if (map.current) {
            map.current.setStyle(activeStyle.url);
        }
    }, [activeStyle]);

    const updateMeasureLine = () => {
        if (!map.current || !turf || measurePoints.current.length < 2) return;

        const line = turf.lineString(measurePoints.current);
        const len = turf.length(line, { units: 'kilometers' });
        setDistance(len);

        const sourceId = 'measure-line';
        const source = map.current.getSource(sourceId);

        if (source) {
            source.setData(line);
        } else {
            map.current.addSource(sourceId, { type: 'geojson', data: line });
            map.current.addLayer({
                id: sourceId,
                type: 'line',
                source: sourceId,
                layout: { 'line-cap': 'round', 'line-join': 'round' },
                paint: { 'line-color': '#0F7143', 'line-width': 4, 'line-dasharray': [2, 1] }
            });
        }
    };

    const clearMeasure = () => {
        measurePoints.current = [];
        setDistance(null);
        if (map.current?.getSource('measure-line')) {
            map.current.removeLayer('measure-line');
            map.current.removeSource('measure-line');
        }
    };

    const copyCoords = () => {
        if (coords) {
            navigator.clipboard.writeText(`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`);
            alert('تم نسخ الإحداثيات');
        }
    };

    return (
        <div className="fixed inset-0 z-[300] bg-white flex flex-col font-sans" dir="rtl">
            {/* Map Header */}
            <div className="absolute top-6 left-6 right-6 z-10 flex flex-col md:flex-row gap-3 pointer-events-none">
                <div className="flex gap-2 pointer-events-auto">
                    <button onClick={onClose} className="bg-white/90 backdrop-blur-md p-4 rounded-[24px] shadow-xl text-slate-900 hover:bg-white transition-all">
                        <X size={24} />
                    </button>
                    <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-[24px] shadow-xl flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0F7143] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#0F7143]/20">
                            <MapIcon size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-slate-900 leading-tight">الخريطة التفاعلية</h2>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">المناقل، السودان</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 max-w-md pointer-events-auto">
                    <div className="relative group">
                        <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0F7143] transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="ابحث عن مكان، حي، أو شارع..." 
                            className="w-full bg-white/90 backdrop-blur-md border-none rounded-[24px] py-4 pr-14 pl-6 font-bold text-slate-700 shadow-xl outline-none focus:ring-4 focus:ring-[#0F7143]/10 transition-all" 
                        />
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <div ref={mapContainer} className="flex-1 w-full h-full" />

            {/* Floating Sidebar Components */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                <div className="bg-white/90 backdrop-blur-md p-2 rounded-[24px] shadow-xl flex flex-col gap-1 border border-white/20">
                    {MAP_STYLES.map((style: any) => (
                        <button 
                            key={style.id}
                            onClick={() => setActiveStyle(style)}
                            className={`p-3 rounded-2xl flex items-center justify-center transition-all ${activeStyle.id === style.id ? 'bg-[#0F7143] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}
                            title={style.name}
                        >
                            {style.icon}
                        </button>
                    ))}
                </div>

                <div className="bg-white/90 backdrop-blur-md p-2 rounded-[24px] shadow-xl flex flex-col gap-1 border border-white/20">
                    <button 
                        onClick={() => { setIsMeasuring(!isMeasuring); if(isMeasuring) clearMeasure(); }}
                        className={`p-3 rounded-2xl flex items-center justify-center transition-all ${isMeasuring ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}
                        title="أداة القياس"
                    >
                        <Ruler size={18} />
                    </button>
                </div>
            </div>

            {/* Coordinate Box (Glassmorphism) */}
            {coords && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-xl animate-slide-up">
                    <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-6 rounded-[32px] shadow-2xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#0F7143]">
                                <Navigation2 size={24} className="rotate-45" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">الإحداثيات الجغرافية</p>
                                <div className="flex gap-4 font-mono text-sm text-white">
                                    <div className="flex gap-2">
                                        <span className="text-white/30">LAT:</span>
                                        <span className="font-bold text-[#4ADE80]">{coords.lat.toFixed(6)}</span>
                                    </div>
                                    <div className="flex gap-2 border-r border-white/10 pr-4">
                                        <span className="text-white/30">LNG:</span>
                                        <span className="font-bold text-[#4ADE80]">{coords.lng.toFixed(6)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={copyCoords}
                            className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all border border-white/5"
                            title="نسخ"
                        >
                            <Copy size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Measurement Result */}
            {distance !== null && (
                <div className="absolute top-28 right-6 animate-fade-in">
                    <div className="bg-orange-500 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3">
                        <Ruler size={18} />
                        <p className="font-black text-sm">المسافة: {distance < 1 ? `${(distance * 1000).toFixed(0)} متر` : `${distance.toFixed(2)} كم`}</p>
                        <button onClick={clearMeasure} className="p-1 hover:bg-white/20 rounded-lg"><X size={14}/></button>
                    </div>
                </div>
            )}
            
            <style>{`
                .maplibregl-popup-content {
                    border-radius: 24px;
                    padding: 0;
                    overflow: hidden;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                }
                .maplibregl-popup-anchor-bottom .maplibregl-popup-tip {
                    border-top-color: white;
                }
                @keyframes slide-up {
                    from { transform: translate(-50%, 40px); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default MarketMap;
