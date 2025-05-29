import React, { useState, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, DollarSign, Calendar, Filter, ChevronUp, ChevronDown } from 'lucide-react';
import cryptoData from './data/cryptoData.json';

const App = () => {
    const [ searchTerm, setSearchTerm ] = useState('');
    const [ sortField, setSortField ] = useState('name');
    const [ sortDirection, setSortDirection ] = useState('asc');
    const [ filterStatus, setFilterStatus ] = useState('all');
    const [ data ] = useState(cryptoData.cryptocurrencies);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (field) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
    };

    const filteredAndSortedData = useMemo(() => {
        let filtered = data.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filterStatus !== 'all') {
            filtered = filtered.filter(item => item.status === filterStatus);
        }

        return filtered.sort((a, b) => {
            let aVal = a[ sortField ];
            let bVal = b[ sortField ];

            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (sortDirection === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
    }, [ data, searchTerm, sortField, sortDirection, filterStatus ]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: price < 1 ? 4 : 2
        }).format(price);
    };

    const formatChange = (change) => {
        const sign = change >= 0 ? '+' : '';
        return `${ sign }${ change.toFixed(2) }%`;
    };

    const getChangeColor = (change) => {
        if (change > 0) return 'text-yellow-400';
        if (change < 0) return 'text-red-400';
        return 'text-gray-400';
    };

    const getStatusBadge = (status) => {
        const badges = {
            bullish: 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 border-yellow-500/30',
            bearish: 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 border-red-500/30',
            neutral: 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-400 border-gray-500/30'
        };

        return (
            <span className={ `px-3 py-1 rounded-full text-xs font-medium border ${ badges[ status ] } backdrop-blur-sm` }>
                { status.charAt(0).toUpperCase() + status.slice(1) }
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
            {/* Animated background elements */ }
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Header */ }
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-4">
                        Portfolio
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">

                    </p>
                </div>

                {/* Controls */ }
                <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Search */ }
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search cryptocurrencies..."
                            value={ searchTerm }
                            onChange={ (e) => setSearchTerm(e.target.value) }
                            className="w-full pl-10 pr-4 py-3 bg-black/50 border border-yellow-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 backdrop-blur-sm transition-all duration-300"
                        />
                    </div>

                    {/* Filter */ }
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                            value={ filterStatus }
                            onChange={ (e) => setFilterStatus(e.target.value) }
                            className="pl-10 pr-8 py-3 bg-black/50 border border-yellow-500/20 rounded-xl text-white focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 backdrop-blur-sm transition-all duration-300 appearance-none cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            <option value="bullish">Bullish</option>
                            <option value="bearish">Bearish</option>
                            <option value="neutral">Neutral</option>
                        </select>
                    </div>
                </div>

                {/* Table */ }
                <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-yellow-500/20 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border-b border-yellow-500/20">
                                    <th
                                        className="px-6 py-4 text-left cursor-pointer hover:bg-yellow-500/5 transition-colors duration-200"
                                        onClick={ () => handleSort('name') }
                                    >
                                        <div className="flex items-center space-x-2 text-yellow-400 font-semibold">
                                            <span>Asset</span>
                                            { getSortIcon('name') }
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-4 text-right cursor-pointer hover:bg-yellow-500/5 transition-colors duration-200"
                                        onClick={ () => handleSort('price') }
                                    >
                                        <div className="flex items-center justify-end space-x-2 text-yellow-400 font-semibold">
                                            <DollarSign className="w-4 h-4" />
                                            <span>Price</span>
                                            { getSortIcon('price') }
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-4 text-right cursor-pointer hover:bg-yellow-500/5 transition-colors duration-200"
                                        onClick={ () => handleSort('change') }
                                    >
                                        <div className="flex items-center justify-end space-x-2 text-yellow-400 font-semibold">
                                            <TrendingUp className="w-4 h-4" />
                                            <span>24h Change</span>
                                            { getSortIcon('change') }
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-4 text-center cursor-pointer hover:bg-yellow-500/5 transition-colors duration-200"
                                        onClick={ () => handleSort('status') }
                                    >
                                        <div className="flex items-center justify-center space-x-2 text-yellow-400 font-semibold">
                                            <Calendar className="w-4 h-4" />
                                            <span>Status</span>
                                            { getSortIcon('status') }
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                { filteredAndSortedData.map((item, index) => (
                                    <tr
                                        key={ item.id }
                                        className="border-b border-gray-800/50 hover:bg-yellow-500/5 transition-all duration-300 group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-sm">
                                                    { item.symbol.charAt(0) }
                                                </div>
                                                <div>
                                                    <div className="text-white font-medium group-hover:text-yellow-400 transition-colors duration-200">
                                                        { item.name }
                                                    </div>
                                                    <div className="text-gray-400 text-sm font-mono">
                                                        { item.symbol }
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="text-white font-mono text-lg group-hover:text-yellow-400 transition-colors duration-200">
                                                { formatPrice(item.price) }
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className={ `font-mono text-lg font-medium flex items-center justify-end space-x-1 ${ getChangeColor(item.change) }` }>
                                                { item.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" /> }
                                                <span>{ formatChange(item.change) }</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            { getStatusBadge(item.status) }
                                        </td>
                                    </tr>
                                )) }
                            </tbody>
                        </table>
                    </div>

                    { filteredAndSortedData.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-lg">No results found</div>
                            <div className="text-gray-500 text-sm mt-2">Try adjusting your search or filter criteria</div>
                        </div>
                    ) }
                </div>

                {/* Stats Footer */ }
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-yellow-500/20 p-6 text-center">
                        <div className="text-3xl font-bold text-yellow-400 mb-2">
                            { filteredAndSortedData.length }
                        </div>
                        <div className="text-gray-400">Assets Tracked</div>
                    </div>
                    <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-yellow-500/20 p-6 text-center">
                        <div className="text-3xl font-bold text-green-400 mb-2">
                            { filteredAndSortedData.filter(item => item.change > 0).length }
                        </div>
                        <div className="text-gray-400">Gainers</div>
                    </div>
                    <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-yellow-500/20 p-6 text-center">
                        <div className="text-3xl font-bold text-red-400 mb-2">
                            { filteredAndSortedData.filter(item => item.change < 0).length }
                        </div>
                        <div className="text-gray-400">Losers</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;